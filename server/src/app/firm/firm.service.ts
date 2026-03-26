import httpStatus from "@/constants";
import { prisma } from "@/db";
import AppError from "@/helpers/errors/AppError";
import QueryBuilder from "@/helpers/prisma/query-builder";
import { deleteFromMinIO, uploadToMinIO } from "@/lib/uploadFileToStorage";
import { generatePropFirmSlug } from "@/utils/utils";
import { FirmParams } from "./firm.interface";
import { CreateFirm, UpdateFirm } from "./firm.validation";
import { Firm } from "@prisma/client";

const getAllFirms = async (query: FirmParams, userRole?: string) => {
  query.isDeleted = false;
  if (userRole !== "SUPER_ADMIN") {
    query.hidden = false;
  }
  if (query.category === "POPULAR") {
    query.isPopular = true;
  } else if (query.category === "NEW") {
    query.createdAt = {
      gte: new Date(new Date().setDate(new Date().getDate() - 30)),
    };
  }
  if (query.range_yearsInOperation) {
    const range = query.range_yearsInOperation.split("-");
    //range_yearsInOperation= 1-2 || 2-5 || 5+
    const isPlus = range[0].includes("+");
    const firstYearNumber =
      range.length === 1 ? (isPlus ? Number(range[0]) : 0) : Number(range[0]);
    const secondYearNumber =
      range.length === 1 ? (isPlus ? 0 : Number(range[0])) : Number(range[1]);

    const currentYear = new Date().getFullYear();
    const firstYear = currentYear - firstYearNumber;
    const lastYear = currentYear - secondYearNumber;
    query.dateEstablished = {
      ...(isPlus ||
        (range.length > 1 && {
          lte: new Date(new Date().setFullYear(firstYear)),
        })),
      ...(!isPlus && {
        gte: new Date(
          new Date().setFullYear(
            lastYear,
            new Date().getMonth() <= 5 ? 0 : 6,
            1,
          ),
        ),
      }),
    };
    delete query.range_yearsInOperation;
  }
  if (query.sort?.includes("yearsInOperation")) {
    if (query.sort === "yearsInOperation") {
      query.sort = "dateEstablished";
    } else if (query.sort === "-yearsInOperation") {
      query.sort = "-dateEstablished";
    }
  }
  delete query.category;
  query.sort = query.sort || "index";

  // Combined drawdown + program type filter via drawDownProgramTypeMap
  let combinedJsonConditions: any[] | null = null;
  const drawDownsParam = query.array_drawDowns as string | undefined;
  const programTypesParam = query.oneItemArray_programTypes as string | undefined;
  if (drawDownsParam && programTypesParam) {
    const drawdowns = drawDownsParam.split(",").map((v: string) => v.trim());
    const programTypes = programTypesParam.split(",").map((v: string) => v.trim());
    combinedJsonConditions = [];
    for (const dd of drawdowns) {
      for (const pt of programTypes) {
        combinedJsonConditions.push({
          drawDownProgramTypeMap: { path: [dd], array_contains: pt },
        });
      }
    }
    // Remove these from query so QueryBuilder doesn't also apply them
    delete query.array_drawDowns;
    delete query.oneItemArray_programTypes;
  }

  const firmQuery = new QueryBuilder(prisma.firm, query);
  if (combinedJsonConditions) {
    firmQuery.where({ AND: combinedJsonConditions });
  }
  const { data, meta } = await firmQuery
    .search(["title", "ceo"])
    .customFields({
      id: true,
      title: true,
      logoUrl: true,
      slug: true,
      index: true,
      affiliateLink: true,
      dateEstablished: true,
      platforms: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          logoUrl: true,
          title: true,
        },
      },
      firmType: true,
      maxAllocation: true,
      country: true,
      restrictedCountries: true,
      offers: {
        where: { isDeleted: false, showInBanner: true },
        select: {
          code: true,
          offerPercentage: true,
          discountType: true,
          discountText: true,
          discountTextArabic: true,
        },
        take: 1,
      },
      typeOfInstruments: true,
      challengeNames: true,
      challengeNameRecords: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          name: true,
          nameArabic: true,
          discountPercentage: true,
          order: true,
          cnMaxAllocation: true,
          cnNewsTrading: true,
          cnOvernightWeekends: true,
          cnCopyTrading: true,
          cnExperts: true,
          cnMinimumTradingDays: true,
          cnMinimumTradingDaysArabic: true,
        },
      },
    })
    .filter()
    .sort()
    .paginate()
    .exclude()
    .execute();

  const formattedData: Firm[] = data.map((firm: Firm) => ({
    ...firm,
  }));

  return { data: formattedData, meta };
};

const createFirm = async (
  payload: CreateFirm["body"] & { logoUrl?: string },
  logoFile: Express.Multer.File,
) => {
  payload.logoUrl = await uploadToMinIO(logoFile);

  // Auto-derive drawDowns from drawDownProgramTypeMap keys
  if (payload.drawDownProgramTypeMap && Object.keys(payload.drawDownProgramTypeMap).length > 0) {
    payload.drawDowns = Object.keys(payload.drawDownProgramTypeMap);
  }

  const slug = await generatePropFirmSlug(payload.title);
  const lastIndex = await prisma.firm.findFirst({
    where: {
      isDeleted: false,
    },
    orderBy: {
      index: "desc",
    },
  });
  const index = lastIndex ? lastIndex.index + 1 : 0;

  // Extract challengeNames objects before spreading payload
  const challengeNamesData = payload.challengeNames || [];
  const { challengeNames: _cn, ...firmPayload } = payload as any;

  const firm = await prisma.firm.create({
    data: {
      ...firmPayload,
      brokers: {
        connect: payload.brokers.map((brokerId) => ({ id: brokerId })),
      },
      platforms: {
        connect: payload.platforms.map((platformId) => ({ id: platformId })),
      },
      paymentMethods: {
        connect: payload.paymentMethods.map((pmId) => ({ id: pmId })),
      },
      payoutMethods: {
        connect: payload.payoutMethods.map((pmId) => ({ id: pmId })),
      },

      offers: {
        connect: [],
      },

      challengeNameRecords: {
        create: challengeNamesData.map((cn: any, idx: number) => ({
          name: cn.name,
          nameArabic: cn.nameArabic || "",
          discountPercentage: cn.discountPercentage || 0,
          order: idx,
          cnMaxAllocation: cn.cnMaxAllocation || 0,
          cnNewsTrading: cn.cnNewsTrading ?? false,
          cnOvernightWeekends: cn.cnOvernightWeekends ?? false,
          cnCopyTrading: cn.cnCopyTrading ?? false,
          cnExperts: cn.cnExperts ?? false,
          cnMinimumTradingDays: cn.cnMinimumTradingDays || "",
          cnMinimumTradingDaysArabic: cn.cnMinimumTradingDaysArabic || "",
        })),
      },

      logoUrl: payload.logoUrl || "",
      slug,
      affiliateLink: payload.affiliateLink || "",
      index
    },
  });

  return firm;
};

const updatePropFirm = async (
  firmId: string,
  payload: UpdateFirm["body"] & { logoUrl?: string; slug?: string },
  logoFile?: Express.Multer.File,
) => {
  const existedFirm = await prisma.firm.findUnique({
    where: { id: firmId, isDeleted: false },
  });
  if (!existedFirm) throw new AppError(httpStatus.NOT_FOUND, "Firm not found");

  // Upload new logo if provided, and only then delete the old one
  if (logoFile) {
    payload.logoUrl = await uploadToMinIO(logoFile);
    await deleteFromMinIO(existedFirm.logoUrl);
  }

  // Auto-derive drawDowns from drawDownProgramTypeMap keys
  if ((payload as any).drawDownProgramTypeMap && Object.keys((payload as any).drawDownProgramTypeMap).length > 0) {
    payload.drawDowns = Object.keys((payload as any).drawDownProgramTypeMap);
  }

  // Generate slug if title changed
  if (payload.title && payload.title !== existedFirm.title) {
    payload.slug = await generatePropFirmSlug(payload.title);
  }

  // Handle challengeNames as ChallengeName records
  const challengeNamesData = (payload as any).challengeNames;
  delete (payload as any).challengeNames;

  if (challengeNamesData && Array.isArray(challengeNamesData)) {
    // Get existing challenge name records for this firm
    const existingRecords = await prisma.challengeName.findMany({
      where: { firmId, isDeleted: false },
      select: { id: true },
    });
    const existingIds = new Set(existingRecords.map((r) => r.id));
    const incomingIds = new Set(
      challengeNamesData.filter((cn: any) => cn.id).map((cn: any) => cn.id)
    );

    // Soft-delete removed ones
    for (const existingId of existingIds) {
      if (!incomingIds.has(existingId)) {
        await prisma.challengeName.update({
          where: { id: existingId },
          data: { isDeleted: true },
        });
      }
    }

    // Upsert: update existing (by id), create new (no id)
    for (let i = 0; i < challengeNamesData.length; i++) {
      const cn = challengeNamesData[i];
      if (cn.id && existingIds.has(cn.id)) {
        await prisma.challengeName.update({
          where: { id: cn.id },
          data: {
            name: cn.name,
            nameArabic: cn.nameArabic || "",
            discountPercentage: cn.discountPercentage || 0,
            order: i,
            cnMaxAllocation: cn.cnMaxAllocation || 0,
              cnNewsTrading: cn.cnNewsTrading ?? false,
            cnOvernightWeekends: cn.cnOvernightWeekends ?? false,
            cnCopyTrading: cn.cnCopyTrading ?? false,
            cnExperts: cn.cnExperts ?? false,
            cnMinimumTradingDays: cn.cnMinimumTradingDays || "",
            cnMinimumTradingDaysArabic: cn.cnMinimumTradingDaysArabic || "",
          },
        });
      } else {
        await prisma.challengeName.create({
          data: {
            name: cn.name,
            nameArabic: cn.nameArabic || "",
            discountPercentage: cn.discountPercentage || 0,
            order: i,
            firmId,
            cnMaxAllocation: cn.cnMaxAllocation || 0,
              cnNewsTrading: cn.cnNewsTrading ?? false,
            cnOvernightWeekends: cn.cnOvernightWeekends ?? false,
            cnCopyTrading: cn.cnCopyTrading ?? false,
            cnExperts: cn.cnExperts ?? false,
            cnMinimumTradingDays: cn.cnMinimumTradingDays || "",
            cnMinimumTradingDaysArabic: cn.cnMinimumTradingDaysArabic || "",
          },
        });
      }
    }
  }

  const data: any = payload;

  // Relational fields
  if (payload.brokers)
    data.brokers = { set: [], connect: payload.brokers.map((id) => ({ id })) };

  if (payload.platforms)
    data.platforms = {
      set: [],
      connect: payload.platforms.map((id) => ({ id })),
    };

  if (payload.paymentMethods)
    data.paymentMethods = {
      set: [],
      connect: payload.paymentMethods.map((id) => ({ id })),
    };

  if (payload.payoutMethods)
    data.payoutMethods = {
      set: [],
      connect: payload.payoutMethods.map((id) => ({ id })),
    };

  if (payload.scaleupPlans) data.scaleupPlans = payload.scaleupPlans;
  // Perform update
  const updatedFirm = await prisma.firm.update({
    where: { id: firmId },
    data,
  });

  return updatedFirm;
};

const getSingleFirm = async (firmId: string, query: Record<string, any>, userRole?: string) => {
  const isHeader = query.header === "true" ? true : false;
  const isFormData = query.formData === "true" ? true : false;
  const isAdmin = userRole === "SUPER_ADMIN";
  const firm = await prisma.firm.findFirst({
    where: {
      OR: [{ id: firmId }, { slug: firmId }],
      isDeleted: false,
      ...(!isAdmin && { hidden: false }),
    },
    select: {
      id: true,
      affiliateLink: true,
      title: true,
      firmType: true,
      logoUrl: true,
      slug: true,
      ceo: true,
      hidden: true,
      dateEstablished: true,
      country: true,
      ...(!isFormData && {
        _count: {
          select: {
            challenges: {
              where: {
                isDeleted: false,
                ...(!isAdmin && { hidden: false }),
              },
            },
            announcements: true,
            offers: {
              where: {
                isDeleted: false,
                ...(!isAdmin && { hidden: false }),
              },
            },
          },
        },
      }),

      ...(!isHeader && {
        brokers: true,
        platforms: true,
        payoutMethods: true,
        typeOfInstruments: true,
        countries: true,
        maxAllocation: true,
        payoutPolicy: true,
        consistencyRules: true,
        leverage: true,
        leverageArabic: true,
        commission: true,
        commissionArabic: true,
        isPopular: true,
        restrictedCountries: true,
        restrictedCountriesNote: true,
        restrictedCountriesNoteArabic: true,
        spreads: true,
        programTypes: true,
        paymentMethods: true,
        drawDowns: true,
        drawDownProgramTypeMap: true,
        otherFeatures: true,
        challengeNames: true,
        challengeNameRecords: {
          where: { isDeleted: false },
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            nameArabic: true,
            discountPercentage: true,
            order: true,
          },
        },
        allocationRules: true,
        newsTradingAllowedRules: true,
        newsTradingNotAllowedRules: true,
        overnightAndWeekendsHolding: true,
        copyTradingAllowedRules: true,
        copyTradingNotAllowedRules: true,
        expertsAllowedRules: true,
        expertsNotAllowedRules: true,
        riskManagement: true,
        vpnVps: true,
        profitShare: true,
        inactivityRules: true,
        prohibitedStrategies: true,
        accountSizes: true,
        accountSizesArabic: true,
        dailyMaxLoss: true,
        dailyMaxLossArabic: true,
        minimumTradingDays: true,
        minimumTradingDaysArabic: true,
        scaleupPlans: true,
        scaleupPlansArabic: true,

        payoutPolicyArabic: true,
        consistencyRulesArabic: true,
        allocationRulesArabic: true,
        newsTradingAllowedRulesArabic: true,
        newsTradingNotAllowedRulesArabic: true,
        overnightAndWeekendsHoldingArabic: true,
        copyTradingAllowedRulesArabic: true,
        copyTradingNotAllowedRulesArabic: true,
        expertsAllowedRulesArabic: true,
        expertsNotAllowedRulesArabic: true,
        riskManagementArabic: true,
        vpnVpsArabic: true,
        profitShareArabic: true,
        inactivityRulesArabic: true,
        prohibitedStrategiesArabic: true,
        drawDownTexts: true,

        leverageMobileFontSize: true,
        commissionMobileFontSize: true,
        accountSizesMobileFontSize: true,
        allocationRulesMobileFontSize: true,
        dailyMaxLossMobileFontSize: true,
        riskManagementMobileFontSize: true,
        consistencyRulesMobileFontSize: true,
        minimumTradingDaysMobileFontSize: true,
        newsTradingAllowedRulesMobileFontSize: true,
        newsTradingNotAllowedRulesMobileFontSize: true,
        overnightAndWeekendsHoldingMobileFontSize: true,
        copyTradingAllowedRulesMobileFontSize: true,
        copyTradingNotAllowedRulesMobileFontSize: true,
        expertsAllowedRulesMobileFontSize: true,
        expertsNotAllowedRulesMobileFontSize: true,
        vpnVpsMobileFontSize: true,
        profitShareMobileFontSize: true,
        payoutPolicyMobileFontSize: true,
        scaleupPlansMobileFontSize: true,
        inactivityRulesMobileFontSize: true,
        prohibitedStrategiesMobileFontSize: true,
        restrictedCountriesNoteMobileFontSize: true,
      }),
      ...(!isFormData && {
        offers: {
          where: {
            isDeleted: false,
            showInBanner: true,
            ...(!isAdmin && { hidden: false }),
          },
          take: 1,
        },
      }),
    },
  });

  if (!firm) throw new AppError(httpStatus.NOT_FOUND, "Firm not found");

  const formattedData = {
    ...firm,
    ...(!isFormData && {
      count: {
        challenges: firm._count.challenges,
        announcements: firm._count.announcements,
        offers: firm._count.offers,
      },
    }),
    _count: undefined,
  };

  return formattedData;
};

const deleteFirm = async (firmId: string) => {
  const firm = await prisma.firm.update({
    where: { id: firmId },
    data: {
      isDeleted: true,
    },
  });

  return firm;
};

const changeIndexOfFirm = async (firmId: string, index: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.firm.findUniqueOrThrow({
      where: { id: firmId, isDeleted: false },
      select: { index: true },
    });

    const oldIndex = item.index;

    if (oldIndex === index) {
      return null;
    }

    if (index < oldIndex) {
      await tx.firm.updateMany({
        where: {
          index: {
            gte: index,
            lt: oldIndex,
          },
          isDeleted: false,
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });
    } else {
      await tx.firm.updateMany({
        where: {
          index: {
            gt: oldIndex,
            lte: index,
          },
          isDeleted: false,
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });
    }

    return await tx.firm.update({
      where: { id: firmId, isDeleted: false },
      data: { index },
    });
  });

  return result;
};

export const FirmService = {
  createFirm,
  getAllFirms,
  updatePropFirm,
  getSingleFirm,
  deleteFirm,
  changeIndexOfFirm,
};
