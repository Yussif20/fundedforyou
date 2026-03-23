export type Announcement = {
    title: string;
    image: string;
    content: string;
    date: string;
    button: {
        text: string;
        url: string;
    };
}
export const announcements: Announcement[] = [
    {
        title: "MT5 is back - FundingPips",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
        content: `<p>As we approach our third year of operations with more than $10 million in rewards and more than 1 million traders worldwide, MT5 is finally back by your request!</p>
              <p>MT5 is back with FundingPips' own license. Built by Traders for Traders — your satisfaction is our priority.</p>
              <p>Thank you for your patience and loyalty. We remain committed to making trading accessible for everyone.</p>
              <p>Stay Blessed!</p>
              <p class="font-medium">FundingPips CEO,<br/>Khaled</p>`,
        date: "March 17, 2025",
        button: {
            text: "Announcement Link",
            url: "https://fundingpips.com/announcement/mt5-back"
        }
    },
    {
        title: "New Trading Dashboard Update",
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
        content: `<p>We are excited to introduce a redesigned trading dashboard built for speed and clarity.</p>
              <p>The update includes improved chart performance, faster order execution, and a more intuitive layout.</p>
              <p>Your feedback directly shaped this version — thank you!</p>`,
        date: "February 10, 2025",
        button: {
            text: "Read More",
            url: "#"
        }
    },
    {
        title: "Weekly Payout System Improved",
        image: "https://images.unsplash.com/photo-1581091870630-fd1ca04f0952?w=400&h=300&fit=crop",
        content: `<p>Our payout process is now even faster — enjoy weekly payouts with reduced verification time.</p>
              <p>We continue to optimize our financial systems to support traders globally.</p>`,
        date: "January 28, 2025",
        button: {
            text: "View Update",
            url: "#"
        }
    },
    {
        title: "New Crypto Deposit Options",
        image: "https://images.unsplash.com/photo-1621768216002-6e4c36de5c48?w=400&h=300&fit=crop",
        content: `<p>We now support USDT, BTC, ETH, and more for fast and secure deposits.</p>
              <p>This upgrade reduces waiting times and ensures smoother funding for your accounts.</p>`,
        date: "January 02, 2025",
        button: {
            text: "See Details",
            url: "#"
        }
    },
    {
        title: "Holiday Trading Schedule Notice",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
        content: `<p>Please be informed of the upcoming holiday schedule that affects market hours.</p>
              <p>Make sure to plan your trades accordingly to avoid unexpected market closures.</p>`,
        date: "December 20, 2024",
        button: {
            text: "View Schedule",
            url: "#"
        }
    }
];
