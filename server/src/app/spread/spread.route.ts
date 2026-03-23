import express from "express";
import { authorize } from "@/middlewares";
import { SpreadService } from "./spread.service";
import { SpreadSymbolValueService } from "./spreadSymbolValue.service";
import { SymbolService } from "./symbol.spread.service";

const router = express.Router();

/** ---------------- SPREAD ROUTES ---------------- **/

router.get("/", SpreadService.getAllFirmsAndSpread);

router.get("/:id", SpreadService.getSingleFirmAndSpread);

router.post(
    "/",
    authorize("SUPER_ADMIN"),
    SpreadService.createSpread
);

router.patch(
    "/:id",
    authorize("SUPER_ADMIN"),
    SpreadService.updateSpread
);

router.delete(
    "/:id",
    authorize("SUPER_ADMIN"),
    SpreadService.deleteSpread
);

/** ---------------- SPREAD SYMBOL VALUE ROUTES ---------------- **/

router.post(
    "/symbol-value",
    authorize("SUPER_ADMIN"),
    SpreadSymbolValueService.createSymbolValue
);

router.get(
    "/:id/symbol-values",
    SpreadSymbolValueService.getAllSymbolValueBySpreadId
);

router.get(
    "/symbol-value/:id",
    SpreadSymbolValueService.getSingleSymbolValue
);

router.patch(
    "/symbol-value/:id",
    authorize("SUPER_ADMIN"),
    SpreadSymbolValueService.updateSymbolValue
);

router.delete(
    "/symbol-value/:id",
    authorize("SUPER_ADMIN"),
    SpreadSymbolValueService.deleteSymbolValue
);

/** ---------------- SYMBOL ROUTES ---------------- **/

router.post(
    "/symbol",
    authorize("SUPER_ADMIN"),
    SymbolService.createSymbol
);

router.get("/symbol/all", SymbolService.getAllSymbols);

router.get("/symbol/:id", SymbolService.getSingleSymbol);

router.patch(
    "/symbol/:id",
    authorize("SUPER_ADMIN"),
    SymbolService.updateSymbol
);

router.delete(
    "/symbol/:id",
    authorize("SUPER_ADMIN"),
    SymbolService.deleteSymbol
);

export const SpreadRoutes = router;
