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
  @IsNotEmpty()
  limit!: number;

  @IsNumber()
  @IsNotEmpty()
  offset!: number;

  @IsString()
  @IsOptional()
  userId!: string;
}

// Controller for wallet endpoints
@JsonController('/api/v1/wallets')
export class WalletController {

  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  // Create wallet
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

  // List wallets
  @Get('')
  public async listWallets(
    @QueryParams() query: ListWalletsQuery
  ): Promise<object> {
    try {
      const wallets = await this.walletService.list(query);

      return {
        count: wallets.length,
        wallets: wallets
      };
    } catch (error) {
      console.error('Error listing wallets:', error);
      throw error;
    }
  }

  // Get wallet by ID
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

  // Update wallet by ID
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

  // Delete wallet by ID
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
