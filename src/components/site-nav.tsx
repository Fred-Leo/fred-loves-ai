import Image from "next/image";
import Link from "next/link";

export default function SiteNav() {
  return <nav className="site-nav shell" aria-label="Primary navigation">
    <Link href="/" className="wordmark" aria-label="Fred Loves AI home"><Image src="/brand/fred-lavender-logo.png" alt="Fred Loves AI" width={1774} height={887} unoptimized priority /><span className="wordmark-byline">By Leo Helzberg</span></Link>
    <div className="nav-links"><Link href="/#integration">AI integration</Link><Link href="/#experience">Experience</Link><Link href="/about">About Leo</Link><Link href="/#contact" className="nav-cta">Get in touch <span aria-hidden="true">↗</span></Link></div>
  </nav>;
}
