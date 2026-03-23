import httpStatus from "@/constants";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { BrokerService } from "./broker.service";

const getAllBroker = catchAsync(async (req, res) => {
  const data = await BrokerService.getAllBroker(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Brokers retrieved successfully",
    data: data,
  });
});

const getSingleBroker = catchAsync(async (req, res) => {
  const brokerId = req.params.brokerId;
  const data = await BrokerService.getSingleBroker(brokerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Broker retrieved successfully",
    data: data,
  });
});

const createBroker = catchAsync(async (req, res) => {
  const logoFile = req.file as Express.Multer.File;
  const data = await BrokerService.createBroker(req.body, logoFile);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Broker created successfully",
    data: data,
  });
});

const updateBroker = catchAsync(async (req, res) => {
  const logoFile = req.file as Express.Multer.File;
  const brokerId = req.params.brokerId;
  const data = await BrokerService.updateBroker(brokerId, req.body, logoFile);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Broker updated successfully",
    data: data,
  });
});

const deleteBroker = catchAsync(async (req, res) => {
  const brokerId = req.params.brokerId;
  const data = await BrokerService.deleteBroker(brokerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Broker deleted successfully",
    data: data,
  });
});

export const BrokerController = {
  createBroker,
  deleteBroker,
  getAllBroker,
  getSingleBroker,
  updateBroker,
};
