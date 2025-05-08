import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

export default function useCookieConsent() {
  // Retrieve cookieConsent from injection
  const cookieConsent = provide('cookieConsent', CookieConsent);
    return CookieConsent;  
}
