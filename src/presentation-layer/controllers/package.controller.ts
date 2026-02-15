import { AddPackagePriceInput } from "../../application-layer/use-cases/package/add-package-price.use-case";
import { CreatePackageWithPriceInput } from "../../application-layer/use-cases/package/create-package-with-price.use-case";
import { PackageTypeValue, Price } from "../../domain-layer";
import {
  AddPackagePriceRequestDto,
  AddPackagePriceResponseDto,
  CreatePackageRequestDto,
  CreatePackageResponseDto,
} from "../types";
import { PackageMapper } from "../mappers";
import { BadRequestError } from "../errors/http-errors";
import { UseCase } from "../../application-layer/use-cases";

export interface IPackageController {
  addPackagePrice(
    req: AddPackagePriceRequestDto
  ): Promise<AddPackagePriceResponseDto>;
  createPackage(
    req: CreatePackageRequestDto
  ): Promise<CreatePackageResponseDto>;
}

export class PackageController implements IPackageController {
  constructor(
    private readonly addPackagePriceUseCase: UseCase<AddPackagePriceInput, Price>, // AddPackagePriceUseCase,
    private readonly createPackageWithPriceUseCase: UseCase<CreatePackageWithPriceInput, Price> // CreatePackageWithPriceUseCase
  ) {}

  public async addPackagePrice(
    req: AddPackagePriceRequestDto
  ): Promise<AddPackagePriceResponseDto> {
    const {
      packageType,
      valueCents,
      currency,
      effectiveDate,
      municipalityName,
    } = req;

    if (
      !packageType ||
      valueCents === undefined ||
      !currency ||
      !effectiveDate
    ) {
      throw new BadRequestError(
        "Missing required fields: packageType, valueCents, currency, and effectiveDate are required"
      );
    }

    const price = await this.addPackagePriceUseCase.execute({
      packageType: packageType as PackageTypeValue,
      valueCents,
      currency,
      effectiveDate: new Date(effectiveDate),
      municipalityName,
    });

    return PackageMapper.toAddPackagePriceResponseDto(price);
  }

  public async createPackage(
    req: CreatePackageRequestDto
  ): Promise<CreatePackageResponseDto> {
    const {
      packageType,
      valueCents,
      currency,
      effectiveDate,
      municipalityName,
    } = req;

    if (
      !packageType ||
      valueCents === undefined ||
      !currency ||
      !effectiveDate
    ) {
      throw new BadRequestError(
        "Missing required fields: packageType, valueCents, currency, and effectiveDate are required"
      );
    }

    const price = await this.createPackageWithPriceUseCase.execute({
      packageType: packageType as PackageTypeValue,
      valueCents,
      currency,
      effectiveDate: new Date(effectiveDate),
      municipalityName,
    });

    return PackageMapper.toCreatePackageResponseDto(price);
  }
}
