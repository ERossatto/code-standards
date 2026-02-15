/**
 * Composition Root Factory - Demonstrates proper dependency injection setup
 *
 * In a real application, I would use a proper DI container like:
 * - inversify
 *
 * This factory shows how controllers should be instantiated with their dependencies
 */

import { MunicipalityController } from "./presentation-layer/controllers/municipality.controller";
import { PriceController } from "./presentation-layer/controllers/price.controller";
import { PackageController } from "./presentation-layer/controllers/package.controller";

import { CreateMunicipalityUseCase } from "./application-layer/use-cases/municipality/create-municipality.use-case";
import { GetMunicipalityByNameUseCase } from "./application-layer/use-cases/municipality/get-municipality-by-name.use-case";
import { GetPriceHistoryUseCase } from "./application-layer/use-cases/price/get-price-history.use-case";
import { GetCurrentPriceUseCase } from "./application-layer/use-cases/price/get-current-price.use-case";
import { GetAllPricesForPackageTypeUseCase } from "./application-layer/use-cases/price/get-all-prices-for-package-type.use-case";
import { CreatePriceUseCase } from "./application-layer/use-cases/price/create-price.use-case";
import { AddPackagePriceUseCase } from "./application-layer/use-cases/package/add-package-price.use-case";
import { CreatePackageWithPriceUseCase } from "./application-layer/use-cases/package/create-package-with-price.use-case";

import { PriceDomainService } from "./domain-layer/services/price.domain-service";
import { PriceHistoryDomainService } from "./domain-layer/services/price-history.domain-service";
import { PackageDomainService } from "./domain-layer/services/package.domain-service";

import { MunicipalitySequelizeRepository } from "./infrastructure-layer/db-sqlite-sequelize/repositories/municipality.sequelize-repository";
import { PriceSequelizeRepository } from "./infrastructure-layer/db-sqlite-sequelize/repositories/price.sequelize-repository";
import { PackageSequelizeRepository } from "./infrastructure-layer/db-sqlite-sequelize/repositories/package.sequelize-repository";
import { MunicipalityDomainService } from "./domain-layer/services/municipality.domain-service";

/**
 * Factory class to compose controllers with the dependencies
 */
export class DICompositionFactory {
  private static municipalityController: MunicipalityController;
  private static priceController: PriceController;
  private static packageController: PackageController;

  /**
   * Creates and returns a MunicipalityController instance
   * In a real app, this would be handled by a DI container
   */
  public static composeMunicipalityDependencies(): MunicipalityController {
    if (!this.municipalityController) {
      // Infrastructure layer
      const municipalityRepository = new MunicipalitySequelizeRepository();

      // domain layer
      const municipalityDomainService = new MunicipalityDomainService(
        municipalityRepository
      );

      // Application layer (use-cases)
      const createMunicipality = new CreateMunicipalityUseCase(
        municipalityDomainService
      );
      const getMunicipalityByName = new GetMunicipalityByNameUseCase(
        municipalityDomainService
      );

      // Presentation layer
      this.municipalityController = new MunicipalityController(
        createMunicipality,
        getMunicipalityByName
      );
    }

    return this.municipalityController;
  }

  /**
   * Creates and returns a PriceController instance
   * In a real app, this would be handled by a DI container
   */
  public static composePriceDependencies(): PriceController {
    if (!this.priceController) {
      // Infrastructure layer
      const priceRepository = new PriceSequelizeRepository();
      const municipalityRepository = new MunicipalitySequelizeRepository();
      const packageRepository = new PackageSequelizeRepository();

      // Domain layer services
      const priceHistoryDomainService = new PriceHistoryDomainService(
        priceRepository
      );
      const priceDomainService = new PriceDomainService(
        priceRepository,
        packageRepository,
        municipalityRepository
      );

      // Application layer (use-cases)
      const getPriceHistory = new GetPriceHistoryUseCase(
        priceHistoryDomainService
      );
      const getCurrentPrice = new GetCurrentPriceUseCase(priceDomainService);
      const createPrice = new CreatePriceUseCase(priceDomainService);
      const getAllPricesForPackageType = new GetAllPricesForPackageTypeUseCase(
        priceRepository
      );

      // Presentation layer
      this.priceController = new PriceController(
        getPriceHistory,
        getCurrentPrice,
        getAllPricesForPackageType,
        createPrice
      );
    }

    return this.priceController;
  }

  /**
   * Creates and returns a PackageController instance
   * In a real app, this would be handled by a DI container
   */
  public static composePackageDependencies(): PackageController {
    if (!this.packageController) {
      // Infrastructure layer
      const packageRepository = new PackageSequelizeRepository();
      const priceRepository = new PriceSequelizeRepository();
      const municipalityRepository = new MunicipalitySequelizeRepository();

      // Domain layer services
      const packageDomainService = new PackageDomainService(packageRepository);
      const priceHistoryDomainService = new PriceHistoryDomainService(
        priceRepository
      );
      const priceDomainService = new PriceDomainService(
        priceRepository,
        packageRepository,
        municipalityRepository
      );

      // Application layer (use-cases)
      const addPackagePrice = new AddPackagePriceUseCase(
        packageRepository,
        priceDomainService
      );

      const createPackageWithPrice = new CreatePackageWithPriceUseCase(
        packageDomainService,
        priceDomainService
      );

      // Presentation layer
      this.packageController = new PackageController(
        addPackagePrice,
        createPackageWithPrice
      );
    }

    return this.packageController;
  }
}
