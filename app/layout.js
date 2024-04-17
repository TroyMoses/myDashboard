import './ui/globals.css';
import Head from 'next/head';

export const metadata = {
    title: 'Admin Dashboard',
    description: 'Developed by TroyMoses',
}

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                { children }
            </body>
        </html>
    )
}