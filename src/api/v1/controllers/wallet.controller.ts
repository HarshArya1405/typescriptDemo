import { Wallet } from '../../models';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { WalletService } from '../services/wallet.service';
import { IsNotEmpty, IsString, IsNumber, isUUID, IsOptional } from 'class-validator';
import { BadRequestParameterError } from '../../errors';

// Define the base wallet class with common properties
class BaseWallet {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;
}

// Define the body for creating wallet
class CreateWalletBody extends BaseWallet {}

// Define the query parameters for listing wallets
class ListWalletsQuery {
  @IsNumber()
  @IsOptional()
  limit!: number;

  @IsNumber()
  @IsOptional()
  offset!: number;
}

// Controller for wallet endpoints
@JsonController('/api/v1/wallets')
export class WalletController {

  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  /**
   * Endpoint to create a wallet
   * @param userId ID of the user
   * @param body Wallet data to create
   * @returns Created wallet
   */
  @Post('/:userId')
  @ResponseSchema(Wallet)
  public async createWallet(
    @Param('userId') userId: string,
    @Body() body: CreateWalletBody
  ): Promise<Wallet> {
    try {
      const wallet = new Wallet();
      wallet.name = body.name;
      wallet.address = body.address;
      wallet.userId = userId;

      return await this.walletService.create(userId, wallet);
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  /**
   * Endpoint to list wallets
   * @param userId ID of the user
   * @param query Query parameters
   * @returns List of wallets
   */
  @Get('/:userId')
  public async listWallets(
    @Param('userId') userId: string,
    @QueryParams() query: ListWalletsQuery
  ): Promise<object> {
    try {
      if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
      return await this.walletService.list(userId, query);
    } catch (error) {
      console.error('Error listing wallets:', error);
      throw error;
    }
  }

  /**
   * Endpoint to get a wallet by ID
   * @param userId ID of the user
   * @param id ID of the wallet
   * @returns Wallet information
   */
  @Get('/:userId/:id')
  public async getWallet(
    @Param('userId') userId: string,
    @Param('id') id: string
  ): Promise<Wallet> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.walletService.get(userId, id);
      return result;
    } catch (error) {
      console.error('Error getting wallet:', error);
      throw error;
    }
  }

  /**
   * Endpoint to update a wallet by ID
   * @param userId ID of the user
   * @param id ID of the wallet
   * @param newData New wallet data
   * @returns Updated wallet
   */
  @Put('/:userId/:id')
  public async updateWallet(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() newData: BaseWallet
  ): Promise<Wallet> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.walletService.update(userId, id, newData);
      return result;
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  }

  /**
   * Endpoint to delete a wallet by ID
   * @param userId ID of the user
   * @param id ID of the wallet
   * @returns Success message or error
   */
  @Delete('/:userId/:id')
  public async deleteWallet(
    @Param('userId') userId: string,
    @Param('id') id: string
  ): Promise<{ success: boolean } | { error: string }> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.walletService.delete(userId, id);
      return result;
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  }
}
