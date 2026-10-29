# Fred Loves AI

Personal website of Leo Helzberg, an economics student at CU Boulder, about AI integration and work experience.

## Source and hosting

- Canonical source: https://github.com/Fred-Leo/fred-loves-ai (main).
- Existing Sites project: `appgprj_6ae23f1fd9488191b291cfbf9ebf0539`. Reuse it; do not create a replacement.
- Public website: https://fredlovesai.com and https://www.fredlovesai.com.
- Original Sites URL: https://fred-loves-ai-preview-leo.zippygoose4.chatgpt.site.
- Domain remains registered at Porkbun.

## Run and validate

```sh
npm ci
npm run dev
```

Before every publication:

```sh
npm run lint
npm run build
```

## Publish GitHub changes to the existing Site

GitHub Actions runs checks only. A green check does **not** publish the website. Public automatic publication is not enabled.

An authorized tool with Sites access must:
1. Pull the latest GitHub main and record its commit SHA. Treat GitHub as authoritative for application files; preserve the homepage unless explicitly asked to redesign it.
2. Read the existing project with Sites `get_site`, then obtain `create_source_repository_write_credential` for the project ID above.
3. Use the Sites skill's `scripts/site-workflow.mjs --project-id appgprj_6ae23f1fd9488191b291cfbf9ebf0539` to open the existing hosted source. Pass credentials through hidden stdin, never commit or print them.
4. Synchronize the approved GitHub application changes into that existing checkout. Preserve its `.openai/hosting.json` identity. The current deployment is a Next static export with `output: "export"`, `trailingSlash: true`, and `static.directory: "out"`. The GitHub development config currently uses normal Next output; preserve the hosted export configuration for static deployment. Server contact delivery requires a supported Worker backend or external form service; a static export alone cannot hold server credentials.
5. Run `npm run lint` and `npm run build` on the final deployment inputs. Package using the same Sites workflow helper, with the prior opening result, credential, an absolute archive path, and remaining ordered commands. The framework build helper is `scripts/build-site.mjs` from the installed Sites plugin.
6. Use the helper's exact pushed `commit_sha` and archive with Sites `save_site_version`, then `deploy_site_version` for this public project. Do not switch its audience. Poll nonterminal deployment status until succeeded or failed.
7. Verify the public domain and record the deployed version and corresponding GitHub SHA.

The hosted source repository is a deployment mirror, not a replacement for GitHub. Never edit only that mirror and leave GitHub behind.

## DNS and email status (2026-10-29)

Both hostnames were verified active with active TLS and opened publicly without a ChatGPT login.

Porkbun website records:
- Root A: `162.159.143.30` and `172.66.3.26`.
- `www` CNAME: `custom-domains.chatgpt.site.`.
- Sites validation TXT records exist for both hostnames. Refresh returned instructions through Sites before changing them.
- The previous root ALIAS served Porkbun Link in Bio and was replaced. Existing wildcard routing and unrelated records were preserved.

Existing Zoho MX, domain verification, SPF and DKIM records were preserved. Do not replace those MX records with Porkbun forwarding until the existing Zoho mailboxes have been inspected. Do not add a second SPF record.

Requested setup: deliver domain email and contact submissions to Leo's confirmed personal Gmail inbox, with authenticated Gmail "Send mail as" for domain addresses. Zoho sign-in is required to verify the existing mailbox/service. No mailbox or subscription was purchased. A DMARC policy and any sending-provider changes remain pending provider verification.

## Contact form

The form is present but deliberately disabled. No delivery success or arrival test has been claimed. Finish email/provider setup before enabling it:
- Send to the confirmed destination; use the visitor email as Reply-To, never as an unverified From address.
- Keep API credentials in server runtime secrets.
- Validate lengths and email fields on the server, constrain origins, and add basic spam/rate protection.
- Return success only after the mail provider accepts delivery; verify actual inbox arrival.
- Preserve the current visual design.

## Design

Preserve the cream, blue, and lime identity, separate About page, and Leo's wording. Keep unrelated essays out of this site. `public/brand/fred-logo-concept-v1.png` is an inactive concept. Do not commit secrets.
