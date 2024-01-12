import Database from "../../loaders/database"
import { tableCreatePrisma } from "../../types/admin/tableType";
import { IPrismaOptions } from "../../types/prisma/prisma";

export class TableService {
    static async create(table_number: number, qrcode: string) {
        try {
            const document: tableCreatePrisma = {
                table_number,
                qrcode
            }
            const result = await Database.instance.table.create({
                data: document
            });
            return result;
        } catch (error) {
            console.log('error in creating table:', error);
            throw new Error('SomethingWentWrong');
        }
    }

    // to get all tables for ADMIN FE
    // Table number:1,  OTP,  PAYMENT? 
    static async getAll(
        page?: number,
        limit?: number,
        options?: IPrismaOptions
    ) {
        try {
            const db = options?.transaction || Database.instance;

            const totalTables = await db.table.count({});
            const currentPage = page ?? 1;
            const itemsPerPage = limit ?? 10;
            const pages = Math.ceil(totalTables / itemsPerPage);

            const result = await Database.instance.table.findMany({
                select: {
                    table_number: true,
                    otp: true
                },
                take: itemsPerPage,
                skip: (currentPage - 1) * itemsPerPage,
            });

            const filter_count = result ? result.length : 0;

            // change filter
            return {
                meta: {
                    total_count: totalTables,
                    filter_count: filter_count,
                    pages: pages
                },
                result
            };
        } catch (error) {
            console.log('error in getting all tables:', error);
            throw new Error('SomethingWentWrong');
        }
    }

    static async updateOtp(table_number: number, otp: string) {
        const table = await Database.instance.table.findFirst({
            where: {
                table_number
            }
        });
        if (!table) {
            throw new Error('ResourceNotFound: Table');
        }

        if (table.otp) {
            throw new Error('OTP exists');
        }

        await Database.instance.table.update({
            where: {
                id: table.id
            },
            data: {
                otp: {
                    set: otp
                }
            }
        });

        return true;
    }

    static async getTableByNumber(
        table_number: number,
        options?: IPrismaOptions
    ) {
        if (!table_number) {
            throw new Error('TableNumberNotDefined');
        }
        const db = options?.transaction || Database.instance;

        const result = db.table.findFirst({
            where: {
                table_number
            }
        });

        return result;
    }

}