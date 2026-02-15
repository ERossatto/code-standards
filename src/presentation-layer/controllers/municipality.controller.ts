import { CreateMunicipalityInput } from "../../application-layer/use-cases/municipality/create-municipality.use-case";
import {
  CreateMunicipalityRequestDto,
  CreateMunicipalityResponseDto,
  GetMunicipalityByNameResponseDto,
} from "../types";
import { MunicipalityMapper } from "../mappers";
import { BadRequestError, NotFoundError } from "../errors/http-errors";
import { UseCase } from "../../application-layer/use-cases";
import { Municipality } from "../../domain-layer";

export interface IMunicipalityController {
  createMunicipality(
    req: CreateMunicipalityRequestDto
  ): Promise<CreateMunicipalityResponseDto>;
  getMunicipalityByName(req: {
    name: string;
  }): Promise<GetMunicipalityByNameResponseDto>;
}

export class MunicipalityController implements IMunicipalityController {
  constructor(
    private readonly createMunicipalityUseCase: UseCase<CreateMunicipalityInput, Municipality>, // CreateMunicipalityUseCase,
    private readonly getMunicipalityByNameUseCase: UseCase<string, Municipality | null>, // GetMunicipalityByNameUseCase
  ) {}

  public async createMunicipality(
    req: CreateMunicipalityRequestDto
  ): Promise<CreateMunicipalityResponseDto> {
    const { name, code, country } = req;

    if (!name || !code || !country) {
      throw new BadRequestError(
        "Missing required fields: name, code, and country are required"
      );
    }

    const municipality = await this.createMunicipalityUseCase.execute({
      name,
      code,
      country,
    });

    return MunicipalityMapper.toCreateResponseDto(municipality);
  }

  public async getMunicipalityByName(req: {
    name: string;
  }): Promise<GetMunicipalityByNameResponseDto> {
    const { name } = req;

    if (!name) {
      throw new BadRequestError("Municipality name is required");
    }

    const municipality = await this.getMunicipalityByNameUseCase.execute(name);

    if (!municipality) {
      throw new NotFoundError(`Municipality with name '${name}' not found`);
    }

    return MunicipalityMapper.toGetByNameResponseDto(municipality);
  }
}
