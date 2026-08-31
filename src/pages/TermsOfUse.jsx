// Content lives in a plain array so editing the text never means touching JSX.
// A `body` entry is either a string (paragraph) or an array (bullet list).
import {ArrowLeftFromLine} from "lucide-react";
import {useNavigate} from "react-router-dom";

const SECTIONS = [
    {
        id: "acceptance-of-terms",
        heading: "Acceptance of Terms",
        body: [
            "By visiting this website you agree to these terms. If you do not agree with them, please stop using the site.",
            "These terms cover the website itself. Any construction work we carry out is governed by the separate written contract signed for that project, which takes precedence over anything on this page.",
        ],
    },
    {
        id: "use-of-the-site",
        heading: "Use of the Site",
        body: [
            "You may browse the site, download the documents we publish, and contact us about a project. In return, you agree not to:",
            [
                "Use the site for anything unlawful, or in a way that disrupts it for other visitors.",
                "Attempt to gain access to systems, accounts or data you are not authorised to access.",
                "Copy or scrape the site's content for republication without our written permission.",
                "Send us false contact details or impersonate someone else when making an enquiry.",
            ],
        ],
    },
    {
        id: "quotes-and-pricing",
        heading: "Quotes, Pricing and Documents",
        body: [
            "Price lists and documents published here are indicative and provided for general guidance. They are not an offer and do not form a binding quotation.",
            "Actual cost depends on the site, the scope of work, material availability and the schedule agreed with you. A binding price is only given in a written estimate prepared for your specific project.",
            "We try to keep published information current, but prices and specifications can change without notice.",
        ],
    },
    {
        id: "intellectual-property",
        heading: "Intellectual Property",
        body: [
            "The text, photographs, drawings, layout and branding on this site belong to us or to our licensors and are protected by copyright.",
            "You may view and print pages for your own use in connection with a project you are discussing with us. Any other use — republishing, redistributing or using our images commercially — requires our written permission.",
        ],
    },
    {
        id: "third-party-links",
        heading: "Third-Party Links and Services",
        body: [
            "This site links to and embeds services operated by other companies, such as mapping and document viewers. We do not control those services and are not responsible for their content, availability or practices.",
            "Following an external link means you leave this site, and the other operator's terms and privacy policy apply from that point.",
        ],
    },
    {
        id: "disclaimer",
        heading: "Disclaimer",
        body: [
            "The site and its content are provided \"as is\". We make no warranty that the site will be uninterrupted, error-free, or that the information on it is complete or current at any given moment.",
            "Nothing on this site is engineering, legal, regulatory or financial advice. Do not rely on it as a substitute for a site survey, a structural assessment or professional advice for your specific circumstances.",
        ],
    },
    {
        id: "limitation-of-liability",
        heading: "Limitation of Liability",
        body: [
            "To the extent permitted by law, we are not liable for loss or damage arising from your use of this website, including lost profits, lost business or costs incurred in reliance on published information.",
            "Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for any other liability that cannot lawfully be excluded.",
        ],
    },
    {
        id: "indemnity",
        heading: "Indemnity",
        body: [
            "You agree to cover our reasonable losses and costs if they arise from your misuse of this site or your breach of these terms.",
        ],
    },
    {
        id: "governing-law",
        heading: "Governing Law",
        body: [
            "These terms are governed by the laws of England and Wales, and disputes relating to them fall to the courts of England and Wales.",
        ],
    },
    {
        id: "changes-to-these-terms",
        heading: "Changes to These Terms",
        body: [
            "We may revise these terms from time to time. The revised version applies from the date it is published here, so please check this page occasionally.",
        ],
    },
    {
        id: "contact-us",
        heading: "Contact Us",
        body: [
            "Questions about these terms can be sent to contact@yourcompany.com, by phone on +1 0001110001, or by post to 123 Example Street, London, UK.",
        ],
    },
];

function TermsOfUse() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen w-full bg-gray-900 px-4 py-12 text-white sm:px-6">
            <div className="mx-auto w-full max-w-3xl">

                <button
                    type="button"
                    onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/'))}
                    className="cursor-pointer mb-6 px-4 py-2 gap-3 inline-flex items-center text-lg font-semibold rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95
                    sticky top-6 z-50
                    "
                >
                    <ArrowLeftFromLine size={24} aria-hidden={true}/>Back
                </button>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Use</h1>

                {/* Hardcoded on purpose — this is a fact about the document, not the render date */}
                <p className="mt-2 text-sm text-gray-400">Last updated: 17 August 2026</p>

                <p className="mt-6 text-gray-300">
                    These terms set out the rules for using this website and explain the
                    limits of the information published on it.
                </p>

                <div className="mt-12 flex flex-col gap-10">
                    {SECTIONS.map((section, index) => (
                        <section key={section.id} id={section.id} className="scroll-mt-8">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {index + 1}. {section.heading}
                            </h2>

                            <div className="mt-3 flex flex-col gap-3 text-gray-300">
                                {section.body.map((entry, entryIndex) =>
                                    Array.isArray(entry) ? (
                                        <ul key={entryIndex} className="flex list-disc flex-col gap-2 pl-5">
                                            {entry.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p key={entryIndex}>
                                            {entry}
                                        </p>
                                    )
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default TermsOfUse;
