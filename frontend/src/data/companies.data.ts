import defaultCompanyImg from '@/assets/companyIcon.png';
import { StaticImageData } from 'next/image';
import platformImage from '@/assets/platform.png'
export type TDummyCompany = {
    id: number;
    name: string;
    slug: string;
    country: string;
    yearsInOperation: number;
    assets: string[];
    maxAllocation: number;
    discount: number;
    image: StaticImageData;
    platforms: StaticImageData[];
    spreads: {
        id: string;
        value: string;
    }[]
    spreadPlatform: {
        name: string;
        image: StaticImageData;
    }
};

export const companyDummyData: TDummyCompany[] = [
    {
        id: 1,
        name: 'Alpha Futures',
        slug: 'Alpha-Futures',
        country: 'US',
        yearsInOperation: 8,
        assets: ['Futures', 'Commodities'],
        maxAllocation: 450000,
        discount: 10,
        image: defaultCompanyImg,
        platforms: [platformImage],
        spreads: [
            {
                id: 'group1',
                value: '2-5'
            },
            {
                id: 'group2',
                value: '4-12'
            },
            {
                id: 'group3',
                value: '10-20'
            },
            {
                id: 'group4',
                value: '0.5-1'
            },
            {
                id: 'group5',
                value: '3-6'
            },
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 2,
        name: 'Beta Investments',
        slug: 'Beta-Investments',
        country: 'UK',
        yearsInOperation: 7,
        assets: ['Stocks', 'Indices'],
        maxAllocation: 420000,
        discount: 12,
        image: defaultCompanyImg,
        platforms: [platformImage, platformImage],
        spreads: [
            {
                id: 'group1',
                value: '1-3'
            },
            {
                id: 'group2',
                value: '3-8'
            },
            {
                id: 'group3',
                value: '8-15'
            },
            {
                id: 'group4',
                value: '0.2-0.8'
            },
            {
                id: 'group5',
                value: '5-10'
            }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 3,
        name: 'Gamma Traders',
        slug: 'Gamma-Traders',
        country: 'US',
        yearsInOperation: 9,
        assets: ['Crypto', 'Futures'],
        maxAllocation: 500000,
        discount: 8,
        image: defaultCompanyImg,
        platforms: [platformImage, platformImage],
        spreads: [
            {
                id: 'group1',
                value: '1.5-4'
            },
            {
                id: 'group2',
                value: '5-9'
            },
            {
                id: 'group3',
                value: '12-25'
            },
            {
                id: 'group4',
                value: '0.3-1.2'
            },
            {
                id: 'group5',
                value: '4-7.5'
            }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }

    },
    {
        id: 4,
        name: 'Delta Capital',
        slug: 'Delta-Capital',
        country: 'UK',
        yearsInOperation: 2,
        assets: ['Commodities'],
        maxAllocation: 300000,
        discount: 15,
        image: defaultCompanyImg,
        platforms: [platformImage, platformImage, platformImage, platformImage, platformImage, platformImage],
        spreads: [
            {
                id: 'group1',
                value: '2-6'
            },
            {
                id: 'group2',
                value: '6-10'
            },
            {
                id: 'group3',
                value: '15-30'
            },
            {
                id: 'group4',
                value: '0.4-1'
            },
            {
                id: 'group5',
                value: '5-8'
            }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 5,
        name: 'Epsilon Markets',
        slug: 'Epsilon-Markets',
        country: 'US',
        yearsInOperation: 6,
        assets: ['Forex', 'Indices'],
        maxAllocation: 380000,
        discount: 10,
        image: defaultCompanyImg,
        platforms: [platformImage],
        spreads: [
            { id: 'group1', value: '1-2.5' },
            { id: 'group2', value: '3-7' },
            { id: 'group3', value: '10-18' },
            { id: 'group4', value: '0.2-0.9' },
            { id: 'group5', value: '4-6.5' }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 6,
        name: 'Zeta Finance',
        slug: 'Zeta-Finance',
        country: 'UK',
        yearsInOperation: 8,
        assets: ['Futures', 'Stocks'],
        maxAllocation: 470000,
        discount: 9,
        image: defaultCompanyImg,
        platforms: [platformImage],
        spreads: [
            { id: 'group1', value: '2-4' },
            { id: 'group2', value: '4.5-9.5' },
            { id: 'group3', value: '11-22' },
            { id: 'group4', value: '0.6-1.3' },
            { id: 'group5', value: '3-7' }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 7,
        name: 'Omega Investments',
        slug: 'Omega-Investments',
        country: 'US',
        yearsInOperation: 7,
        assets: ['Crypto', 'Forex'],
        maxAllocation: 440000,
        discount: 11,
        image: defaultCompanyImg,
        platforms: [platformImage, platformImage, platformImage],
        spreads: [
            { id: 'group1', value: '1.2-3.5' },
            { id: 'group2', value: '5-8.5' },
            { id: 'group3', value: '9-17' },
            { id: 'group4', value: '0.4-1' },
            { id: 'group5', value: '4.2-6.8' }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 8,
        name: 'Sigma Partners',
        slug: 'Sigma-Partners',
        country: 'UK',
        yearsInOperation: 6,
        assets: ['Commodities', 'Stocks'],
        maxAllocation: 390000,
        discount: 13,
        image: defaultCompanyImg,
        platforms: [platformImage],
        spreads: [
            { id: 'group1', value: '2.5-5' },
            { id: 'group2', value: '7-12' },
            { id: 'group3', value: '14-26' },
            { id: 'group4', value: '0.3-1' },
            { id: 'group5', value: '3-7' }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 9,
        name: 'Nova Capital',
        slug: 'Nova-Capital',
        country: 'US',
        yearsInOperation: 8,
        assets: ['Futures', 'Crypto'],
        maxAllocation: 460000,
        discount: 10,
        image: defaultCompanyImg,
        platforms: [platformImage],
        spreads: [
            { id: 'group1', value: '1.8-3.8' },
            { id: 'group2', value: '6-11' },
            { id: 'group3', value: '13-24' },
            { id: 'group4', value: '0.5-1.1' },
            { id: 'group5', value: '4-7.2' }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
    {
        id: 10,
        name: 'Prime Holdings',
        slug: 'Prime-Holdings',
        country: 'UK',
        yearsInOperation: 5,
        assets: ['Stocks', 'Indices'],
        maxAllocation: 400000,
        discount: 12,
        image: defaultCompanyImg,
        platforms: [platformImage],
        spreads: [
            { id: 'group1', value: '2-5' },
            { id: 'group2', value: '5.5-10' },
            { id: 'group3', value: '16-28' },
            { id: 'group4', value: '0.4-1.4' },
            { id: 'group5', value: '3.5-6.5' }
        ],
        spreadPlatform: {
            name: 'MT5',
            image: platformImage
        }
    },
];
