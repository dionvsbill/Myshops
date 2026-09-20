import './globals.css'; import {Header} from '@/components/Header'; import {MobileNav} from '@/components/MobileNav';
export const metadata={title:'Myshop Ghana',description:'Ghana-focused ecommerce store'};
export default function Layout({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><MobileNav/></>}