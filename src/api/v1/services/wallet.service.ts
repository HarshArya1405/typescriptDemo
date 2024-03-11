import { Wallet } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { FindManyOptions } from 'typeorm';
import { NoRecordFoundError } from '../../errors';
import { MESSAGES } from '../../constants/messages';
import AnalyticsService from '../../../util/mixPanel.config';

const walletRepository = AppDataSource.getRepository(Wallet);

const analyticsService = new AnalyticsService();

export class WalletService {
    constructor() { }

    public async create(userId: string, data: Partial<Wallet>): Promise<Wallet> {
        try {
            // const existingWallet = await walletRepository.findOne({
            //     where: { userId, name: data.name }
            // });

            // if (existingWallet) {
            //     throw new DuplicateRecordFoundError(MESSAGES.WALLET_NAME_EXIST);
            // }

            const wallet = await walletRepository.save(data);

            // Track analytics for wallet creation
            try {
                await analyticsService.track('Wallet Created', JSON.stringify({ userId, walletId: wallet.id }), userId);
            } catch (err) {
                console.error(`Error tracking wallet creation: ${err}`);
            }

            return wallet;
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    }

    public async get(userId: string, walletId: string): Promise<Wallet> {
        try {
            const wallet = await walletRepository.findOne({
                where: { userId, id: walletId }
            });
            if (!wallet) {
                throw new NoRecordFoundError(MESSAGES.WALLET_NOT_EXIST);
            }
            return wallet;
        } catch (error) {
            console.error('Error getting wallet:', error);
            throw error;
        }
    }

    public async list(searchParams: {userId: string, limit?: number, offset?: number}): Promise<Wallet[]> {
        try {
            const options: FindManyOptions<Wallet> = {
                where: {},
                take: searchParams.limit,
                skip: searchParams.offset,
            };

            const wallets = await walletRepository.find(options);
            return wallets;
        } catch (error) {
            console.error('Error listing wallets:', error);
            throw error;
        }
    }

    public async update(userId: string, walletId: string, data: Partial<Wallet>): Promise<Wallet> {
        try {
            const wallet = await walletRepository.findOne({
                where: { userId, id: walletId }
            });
            if (!wallet) {
                throw new NoRecordFoundError(MESSAGES.WALLET_NOT_EXIST);
            }

            // Update the properties of the wallet object
            Object.assign(wallet, data);
            await walletRepository.save(wallet);

            // Track analytics for wallet update
            try {
                await analyticsService.track('Wallet Updated', JSON.stringify({ userId, walletId }), userId);
            } catch (err) {
                console.error(`Error tracking wallet update: ${err}`);
            }

            return wallet;
        } catch (error) {
            console.error('Error updating wallet:', error);
            throw error;
        }
    }

    public async delete(userId: string, walletId: string): Promise<{ success: boolean } | { error: string }> {
        try {
            const wallet = await walletRepository.findOne({ where: { userId, id: walletId } });
            if (!wallet) {
                throw new NoRecordFoundError(MESSAGES.WALLET_NOT_EXIST);
            }
            await walletRepository.delete(walletId);
            // Track analytics for wallet deletion
            try {
                await analyticsService.track('Wallet Deleted', JSON.stringify({ userId, walletId }), userId);
            } catch (err) {
                console.error(`Error tracking wallet deletion: ${err}`);
            }
            return { success: true };
        } catch (error) {
            console.error('Error deleting wallet:', error);
            throw error;
        }
    }
}
