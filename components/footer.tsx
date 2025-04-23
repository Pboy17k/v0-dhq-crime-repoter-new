"use client"

import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold">{t("footer.about")}</h3>
            <p className="text-sm text-primary-foreground/80">{t("footer.aboutContent")}</p>
            <div className="mt-4 flex items-center">
              <div className="dhq-logo-icon mr-3" style={{ width: "40px", height: "40px" }}>
                <div className="dhq-logo-segment dhq-logo-army"></div>
                <div className="dhq-logo-segment dhq-logo-navy"></div>
                <div className="dhq-logo-segment dhq-logo-airforce"></div>
              </div>
              <span className="font-bold text-lg">DHQ Crime Reporter</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">{t("footer.links")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:underline">
                  {t("nav.report")}
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:underline">
                  {t("nav.map")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:underline">
                  {t("nav.resources")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-lg font-bold">{t("footer.resources")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:underline">
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link href="/helpline" className="hover:underline">
                  {t("footer.helpline")}
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:underline">
                  {t("footer.emergencyServices")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">{t("footer.contact")}</h3>
            <address className="not-italic text-sm space-y-2">
              <p>{t("footer.address")}</p>
              <p>
                <a href="tel:+2348000DEFENCE" className="hover:underline">
                  {t("footer.phone")}
                </a>
              </p>
              <p>
                <a href="mailto:info@dhq-crimereporter.gov.ng" className="hover:underline">
                  {t("footer.email")}
                </a>
              </p>
            </address>
            <div className="mt-4 flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-primary-foreground hover:text-primary-foreground/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-primary-foreground hover:text-primary-foreground/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-primary-foreground hover:text-primary-foreground/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="text-primary-foreground hover:text-primary-foreground/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm">
          <div className="flex justify-center items-center mb-4">
            <div className="dhq-logo-icon mr-2" style={{ width: "24px", height: "24px" }}>
              <div className="dhq-logo-segment dhq-logo-army"></div>
              <div className="dhq-logo-segment dhq-logo-navy"></div>
              <div className="dhq-logo-segment dhq-logo-airforce"></div>
            </div>
            <p>{t("footer.copyright")}</p>
          </div>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/terms" className="hover:underline">
              {t("footer.terms")}
            </Link>
            <span>|</span>
            <Link href="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
