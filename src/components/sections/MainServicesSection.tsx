'use client';

import { useState } from 'react';

export interface BusinessService {
  id: string;
  num: string;
  title: string;
  headline: string;
  description: string;
  ctaText: string;
  deliverables: string[];
  callout?: {
    type: 'scenario' | 'plain-language' | 'note';
    label: string;
    text: string;
    beforeAfter?: { before: string; after: string };
  };
}

export const businessServices: BusinessService[] = [
  {
    id: 'business-websites',
    num: '01',
    title: 'Business Website Development',
    headline: 'Make your business impossible to overlook.',
    description:
      'Give customers a professional place to discover your business, understand your services and take the next step. We design and develop fast, responsive websites that reflect your brand and make it easier for people to contact you.',
    ctaText: 'Build My Website',
    deliverables: [
      'Company and corporate websites',
      'Small-business websites',
      'Service business websites',
      'Landing pages for products and campaigns',
      'Website redesigns',
      'Product and service catalogues',
      'Enquiry forms and WhatsApp contact flows',
      'Search-friendly website foundations',
    ],
    callout: {
      type: 'note',
      label: 'OUR APPROACH TO WEBSITES',
      text: 'We prioritize clear messaging, fast load times on mobile, effortless usability and clear customer inquiry pathways. No bloated templates or unmaintained plugins.',
    },
  },
  {
    id: 'ecommerce-websites',
    num: '02',
    title: 'Ecommerce & Online Shopping Websites',
    headline: 'Take your products from browsing to buying.',
    description:
      'Launch your own online shopping experience where customers can discover products, explore details, place orders and pay online. We help you build a store that matches your products, budget and day-to-day selling process.',
    ctaText: 'Launch My Online Store',
    deliverables: [
      'Online shopping websites',
      'Product catalogue management',
      'Product variants and pricing',
      'Shopping cart and checkout',
      'Payment gateway integration',
      'Order management',
      'Stock and inventory features',
      'Shipping and delivery integrations',
      'Customer notifications',
      'Promotions and discount codes',
      'Store administration dashboards',
    ],
    callout: {
      type: 'note',
      label: 'COMMERCIAL REALITY',
      text: 'A practical, high-conversion option for retailers, wholesalers, and social sellers ready for an independent web store. Required features and third-party gateway charges are explained transparently upfront.',
    },
  },
  {
    id: 'custom-web-apps',
    num: '03',
    title: 'Custom Web Applications',
    headline: "When ordinary software doesn't fit, build what does.",
    description:
      'Every business has processes that are too specific for a generic tool. We develop custom web applications around your actual requirements, so your team can manage information, customers, tasks and operations in one organized place.',
    ctaText: 'Discuss a Custom App',
    deliverables: [
      'Customer and client portals',
      'Admin dashboards',
      'Internal business applications',
      'Booking and appointment systems',
      'Order and service tracking',
      'Inventory and stock applications',
      'Quotation and estimation tools',
      'Customer relationship management systems',
      'Reporting dashboards',
      'Role-based access and approval screens',
      'Minimum viable products for new business ideas',
    ],
    callout: {
      type: 'scenario',
      label: 'PRACTICAL APPLICATION EXAMPLE',
      text: 'Instead of tracking every customer enquiry across separate spreadsheets, imagine a single dashboard where your team can see each enquiry, its owner, its status and the next scheduled action.',
    },
  },
  {
    id: 'workflow-automation',
    num: '04',
    title: 'Business Workflow Automation',
    headline: 'Less repetitive work. More room to grow.',
    description:
      'Reduce the manual steps that slow your business down. We help connect your tools and automate repetitive tasks such as data entry, enquiry routing, reminders, approvals, notifications and routine reporting.',
    ctaText: 'Find What You Can Automate',
    deliverables: [
      'Automated enquiry capture and assignment',
      'Follow-up reminders',
      'Form-to-spreadsheet or database workflows',
      'Email and messaging notifications',
      'Document and data processing',
      'Approval and task assignment workflows',
      'Scheduled reporting',
      'Order status notifications',
      'Integration between business applications',
      'AI-assisted workflows where genuinely useful',
    ],
    callout: {
      type: 'scenario',
      label: 'ILLUSTRATIVE TRANSFORMATION SCENARIO',
      text: 'Before and after workflow automation:',
      beforeAfter: {
        before:
          'An enquiry arrives, someone manually copies it into a spreadsheet, sends a chat message and tries to remember to follow up three days later.',
        after:
          'The enquiry is recorded automatically, assigned to the right person, logged into the pipeline and followed up through a defined workflow.',
      },
    },
  },
  {
    id: 'erp-crm-systems',
    num: '05',
    title: 'ERP, CRM & Business Management Systems',
    headline: 'Bring your business operations into better order.',
    description:
      'Manage customers, sales, purchasing, stock, orders and internal processes with systems that support the way your business operates. We help businesses explore, implement, configure and connect suitable business management software, with custom development where required.',
    ctaText: 'Improve My Business Systems',
    deliverables: [
      'ERP system selection and implementation support',
      'ERP configuration and customization',
      'CRM setup and customization',
      'Sales and customer management',
      'Procurement and purchasing workflows',
      'Inventory and warehouse processes',
      'Order and fulfilment workflows',
      'Business reporting and dashboards',
      'Data migration and integration',
      'Process mapping and system improvement',
    ],
    callout: {
      type: 'plain-language',
      label: 'IN PLAIN LANGUAGE',
      text: 'ERP helps coordinate core business operations and shared stock/financial information. CRM helps organize customers, enquiries, sales opportunities and follow-ups. We only recommend systems matched to your real business complexity.',
    },
  },
  {
    id: 'integrations-dashboards',
    num: '06',
    title: 'Integrations, Dashboards & Digital Tools',
    headline: 'Make your business tools work together.',
    description:
      'When information is scattered across disconnected applications, teams waste time switching between systems and repeating the same work. We connect compatible tools and create clear dashboards so information can move where it is needed.',
    ctaText: 'Connect My Systems',
    deliverables: [
      'API integrations',
      'Website-to-CRM connections',
      'Ecommerce-to-inventory integrations',
      'Payment and order integrations',
      'Third-party service connections',
      'Business reporting dashboards',
      'Data synchronization workflows',
      'Management reporting tools',
      'Custom calculators and internal utilities',
      'AI integrations for specific business tasks',
    ],
    callout: {
      type: 'note',
      label: 'TECHNICAL NOTE',
      text: 'Integration feasibility depends on the access, APIs, permissions and technical capabilities of the specific software packages involved. We audit compatibility before proposing an architecture.',
    },
  },
];

export function MainServicesSection() {
  const [activeTab, setActiveTab] = useState<string>(businessServices[0].id);

  const handleSelectService = (serviceTitle: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hopepitome-select-service', {
          detail: { serviceTitle },
        })
      );
    }
  };

  return (
    <section id="services" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#9DA3AE] uppercase">
            <span className="text-[#9D85FF] font-bold">03 //</span>
            <span className="text-[#F8F9FA] font-medium">WHAT WE BUILD</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-[#9DA3AE] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#9D85FF] inline-block shadow-[0_0_8px_#9D85FF]" />
            <span>SIX COMMERCIAL SERVICE DISCIPLINES</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="pt-10 pb-12 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F8F9FA] mb-4">
            DIGITAL TOOLS AND SYSTEMS DESIGNED FOR BUSINESS.
          </h2>
          <p className="text-[#D0D4DC] text-base leading-relaxed font-sans">
            From customer-facing websites to backend operations and automations, explore our primary
            areas of design, engineering, and systems implementation.
          </p>
        </div>

        {/* Desktop Quick Jump Tabs */}
        <div className="hidden lg:grid grid-cols-6 gap-2.5 mb-10 pb-6 border-b border-white/[0.14]">
          {businessServices.map((srv) => (
            <button
              key={srv.id}
              type="button"
              onClick={() => {
                setActiveTab(srv.id);
                const el = document.getElementById(srv.id);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`p-3 text-left font-mono transition-all border ${
                activeTab === srv.id
                  ? 'border-[#9D85FF] bg-[#9D85FF]/20 text-[#F8F9FA] shadow-[0_0_15px_rgba(157,133,255,0.25)]'
                  : 'border-white/[0.12] bg-[#121520]/80 text-[#D0D4DC] hover:text-white hover:border-[#9D85FF]/60 hover:bg-[#171B2B]'
              }`}
            >
              <span className="text-[10px] text-[#9D85FF] block font-bold mb-1">{srv.num} //</span>
              <span className="text-xs uppercase font-medium leading-tight line-clamp-2">
                {srv.title}
              </span>
            </button>
          ))}
        </div>

        {/* Detailed Service Cards Grid */}
        <div className="space-y-12">
          {businessServices.map((service) => (
            <article
              key={service.id}
              id={service.id}
              className="p-6 sm:p-10 lg:p-12 bg-[#121520]/95 backdrop-blur-md border border-white/[0.16] hover:border-[#9D85FF]/60 hover:bg-[#151928] transition-all duration-300 relative group scroll-mt-28 shadow-xl shadow-black/40"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Overview Column */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center space-x-3 font-mono text-xs text-[#9D85FF] mb-3">
                      <span className="font-bold text-sm">{service.num}</span>
                      <span>//</span>
                      <span className="text-[#9DA3AE] uppercase font-semibold">{service.title}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-[#F8F9FA] tracking-tight mb-4 leading-snug">
                      {service.headline}
                    </h3>

                    <p className="text-[#D0D4DC] text-sm sm:text-base font-sans leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Contextual Callout */}
                  {service.callout && (
                    <div className="p-4.5 bg-[#090B10] border border-[#9D85FF]/40 font-mono text-xs space-y-2 shadow-inner">
                      <span className="text-[#9D85FF] block text-[10px] font-bold tracking-wider uppercase">
                        [ {service.callout.label} ]
                      </span>
                      {service.callout.beforeAfter ? (
                        <div className="space-y-2 font-sans text-xs">
                          <p className="text-red-200">
                            <strong className="text-red-400 font-mono text-[11px] block mb-0.5 font-bold">
                              BEFORE:
                            </strong>
                            {service.callout.beforeAfter.before}
                          </p>
                          <p className="text-[#D0D4DC]">
                            <strong className="text-[#E8E2FF] font-mono text-[11px] block mb-0.5 font-bold">
                              AFTER:
                            </strong>
                            {service.callout.beforeAfter.after}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#D0D4DC] font-sans text-xs leading-relaxed">
                          {service.callout.text}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action CTA */}
                  <div className="pt-2">
                    <a
                      href="#contact"
                      onClick={() => handleSelectService(service.title)}
                      className="inline-flex items-center space-x-2 px-6 py-3.5 bg-white text-[#07080C] hover:bg-[#9D85FF] hover:text-[#07080C] transition-all duration-200 font-mono text-xs uppercase font-bold tracking-wider shadow-md"
                    >
                      <span>{service.ctaText}</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

                {/* Right Deliverables Column */}
                <div className="lg:col-span-7 bg-[#090B10] p-6 sm:p-8 border border-white/[0.14] shadow-inner">
                  <span className="text-xs font-mono tracking-wider uppercase text-[#9DA3AE] block mb-4 font-bold">
                    WHAT WE CAN BUILD &amp; DELIVER:
                  </span>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start space-x-2.5 text-xs font-sans text-[#D0D4DC] p-2.5 bg-white/[0.04] border border-white/[0.08]"
                      >
                        <span className="text-[#9D85FF] font-mono select-none font-bold">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-white/[0.1] flex items-center justify-between text-xs font-mono text-[#9DA3AE]">
                    <span>STATUS // AVAILABLE FOR PROJECT SCOPING</span>
                    <a
                      href="#contact"
                      onClick={() => handleSelectService(service.title)}
                      className="text-[#9D85FF] hover:text-white transition-colors font-semibold"
                    >
                      Inquire regarding this scope →
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MainServicesSection;
