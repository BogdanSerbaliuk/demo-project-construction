import { ArrowLeftFromLine } from 'lucide-react';
import {useNavigate} from "react-router-dom";

const SECTIONS = [
    {
        id: "information-we-collect",
        heading: "Information We Collect",
        body: [
            "We only collect the information we need to answer your enquiry and to keep the site working properly.",
            [
                "Contact details you send us — your name, email address and phone number when you request a quote or write to us.",
                "Project details — the address, drawings, measurements or documents you share so we can prepare an estimate.",
                "Technical data — your browser type, device type, approximate location and the pages you visited, collected automatically by our hosting provider.",
            ],
            "We do not ask for payment card numbers, passwords or identity documents through this website.",
        ],
    },
    {
        id: "how-we-use-your-information",
        heading: "How We Use Your Information",
        body: [
            "Your information is used to prepare and send estimates, to arrange site visits and consultations, to answer questions you send us, and to keep records of the work we carry out.",
            "We may also use aggregated, non-identifying statistics to understand which parts of the site are useful and to improve them.",
            "We do not sell your personal data, and we do not use it for automated decision-making or profiling.",
        ],
    },
    {
        id: "cookies-and-embedded-content",
        heading: "Cookies and Embedded Content",
        body: [
            "This site does not use advertising or tracking cookies of its own.",
            "Some pages embed content from third parties — for example an interactive map from Google Maps. When that content loads, the provider may set its own cookies and receive your IP address. Their handling of that data is covered by their own privacy policies, not this one.",
            "You can block or delete cookies in your browser settings. Blocking them may stop embedded content such as the map from displaying.",
        ],
    },
    {
        id: "sharing-your-information",
        heading: "Sharing Your Information",
        body: [
            "We share your information only where it is necessary:",
            [
                "With team members working on your project.",
                "With subcontractors or suppliers, where their work depends on it — for example a delivery address.",
                "With service providers who host this website or handle our email.",
                "Where we are required to do so by law, or to establish or defend a legal claim.",
            ],
            "We do not share your details with third parties for their own marketing purposes.",
        ],
    },
    {
        id: "data-retention",
        heading: "Data Retention",
        body: [
            "Enquiries that do not lead to a project are kept for up to 12 months and then deleted.",
            "Records connected to completed work — contracts, estimates and correspondence — are kept for as long as we are required to keep them for tax, insurance and warranty purposes, and are deleted once that period ends.",
        ],
    },
    {
        id: "your-rights",
        heading: "Your Rights",
        body: [
            "Depending on where you live, you may have the right to:",
            [
                "Ask for a copy of the personal data we hold about you.",
                "Ask us to correct information that is inaccurate or incomplete.",
                "Ask us to delete your data, where we have no legal reason to keep it.",
                "Object to or ask us to restrict how we use your data.",
                "Withdraw consent at any time, where we relied on your consent.",
            ],
            "To make a request, contact us using the details below. We will respond within one month.",
        ],
    },
    {
        id: "security",
        heading: "Security",
        body: [
            "We use reasonable technical and organisational measures to protect your information, including encrypted connections to this website and restricted access to our records.",
            "No method of transmission over the internet is completely secure, so we cannot guarantee absolute security. Please do not send sensitive documents by email unless we have agreed a secure way to do so.",
        ],
    },
    {
        id: "childrens-privacy",
        heading: "Children's Privacy",
        body: [
            "This website is intended for adults arranging construction work. We do not knowingly collect personal information from children. If you believe a child has sent us personal data, contact us and we will delete it.",
        ],
    },
    {
        id: "changes-to-this-policy",
        heading: "Changes to This Policy",
        body: [
            "We may update this policy as our services or legal obligations change. The date at the top of the page shows when it was last revised, and material changes will be highlighted on this page.",
        ],
    },
    {
        id: "contact-us",
        heading: "Contact Us",
        body: [
            "If you have questions about this policy or about how we handle your data, contact us at contact@yourcompany.com, call +1 0001110001, or write to 123 Example Street, London, UK.",
        ],
    },
];

function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen w-full bg-gray-900 px-4 py-12 text-white sm:px-6">
            <div className="mx-auto w-full max-w-3xl">

                <button
                    type="button"
                    onClick={() => (window.history.length > 2 ? (navigate(-1)) : (navigate('/')))}
                    className="cursor-pointer mb-6 px-4 py-2 gap-3 inline-flex items-center text-lg rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95
                    sticky top-6 z-50
                    "
                >
                    <ArrowLeftFromLine size={24} aria-hidden={true}/>Back
                </button>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>

                {/* Hardcoded on purpose — this is a fact about the document, not the render date */}
                <p className="mt-2 text-sm text-gray-400">Last updated: 17 August 2026</p>

                <p className="mt-6 text-gray-300">
                    This policy explains what personal information we collect through this
                    website, why we collect it, and what you can ask us to do with it.
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

export default PrivacyPolicy;
