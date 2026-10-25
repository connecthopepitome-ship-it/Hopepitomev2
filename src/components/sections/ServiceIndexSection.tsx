'use client';

import { useState } from 'react';

export interface ServiceDetail {
  number: string;
  id: string;
  title: string;
  plainSummary: string;
  division: 'NEXORA' | 'ELEVORA';
  category: string;
  targetCustomer: string;
  scopeOverview: string;
  deliverables: string[];
  process: { step: string; label: string; desc: string }[];
  quotationPath: string;
}

export const studioServices: ServiceDetail[] = [
  // --- NEXORA (BUSINESS SOLUTIONS) ---
  {
    number: '01',
    id: 'business-websites',
    title: 'BUSINESS WEBSITES',
    plainSummary:
      'Give customers a clear, professional place to learn about your business, explore your services and contact you.',
    division: 'NEXORA',
    category: 'WEBSITES & WEB APPS',
    targetCustomer:
      'Small business owners, professional consultancies, service providers, and growing firms needing an up-to-date, trustworthy online presence.',
    scopeOverview:
      'We design and build clean, fast-loading business websites that look great on phones, tablets, and computers. We make sure visitors understand what you offer and can easily reach out through working contact forms.',
    deliverables: [
      'Custom visual design matching your brand colours and logo',
      'Mobile-friendly and tablet-tested responsive layouts',
      'Dedicated pages for your services, company background, and team',
      'Working contact and enquiry forms delivered to your email',
      'Search-engine-friendly structure (SEO titles, descriptions, sitemap)',
      'Reliable hosting setup and domain connection assistance',
    ],
    process: [
      { step: '01', label: 'REQUIREMENTS', desc: 'We discuss your business goals, target clients, and necessary pages.' },
      { step: '02', label: 'BUILD', desc: 'We design and build the pages with your text, images, and contact links.' },
      { step: '03', label: 'LAUNCH', desc: 'We test across devices, connect your domain, and hand over the site.' },
    ],
    quotationPath:
      'Pricing depends on the number of pages, custom features, and whether content writing is needed. We provide an itemized quote after our initial conversation.',
  },
  {
    number: '02',
    id: 'online-stores',
    title: 'ONLINE STORES & E-COMMERCE',
    plainSummary:
      'Sell your products through your own website, with product pages, shopping features and an order-management flow suited to your business.',
    division: 'NEXORA',
    category: 'E-COMMERCE',
    targetCustomer:
      'Retailers, makers, brands, and distributors who want to sell products online with their own direct storefront.',
    scopeOverview:
      'We build clean online shops with simple product browsing, secure payment checkout, automatic order notifications, and straightforward inventory management.',
    deliverables: [
      'Organized product catalog with categories, images, and pricing',
      'Shopping cart and smooth checkout experience',
      'Secure payment gateway setup (e.g., Stripe, PayPal, or regional processors)',
      'Automated email receipts for customers and order alerts for you',
      'Basic inventory and order status management dashboard',
      'Shipping rules and tax configuration support',
    ],
    process: [
      { step: '01', label: 'CATALOG PLANNING', desc: 'We organize your product list, categories, variants, and payment needs.' },
      { step: '02', label: 'STORE SETUP', desc: 'We build the store layout, cart flows, and integrate your payment provider.' },
      { step: '03', label: 'TEST ORDERS', desc: 'We process real test transactions before opening the store to customers.' },
    ],
    quotationPath:
      'Quoted based on catalog size, product variant complexity, and payment gateway choices. Agreed in writing before starting.',
  },
  {
    number: '03',
    id: 'custom-business-software',
    title: 'CUSTOM BUSINESS SOFTWARE',
    plainSummary:
      'Replace disconnected spreadsheets and repetitive manual tasks with software designed around your business process.',
    division: 'NEXORA',
    category: 'CUSTOM TOOLS',
    targetCustomer:
      'Businesses with specific operational steps that off-the-shelf software cannot handle cleanly.',
    scopeOverview:
      'When spreadsheets become disorganized or existing tools are too rigid, we build custom web-based software where your team can log in, track jobs, manage records, and collaborate safely.',
    deliverables: [
      'Tailored web application accessible on desktop and mobile browsers',
      'Secure login accounts with role-based permissions (admin vs staff)',
      'Structured database for records (customers, orders, equipment, jobs)',
      'Data import assistance from your existing spreadsheets',
      'Automated status updates and email notifications',
      'Administrator training and written system documentation',
    ],
    process: [
      { step: '01', label: 'WORKFLOW MAPPING', desc: 'We document your exact step-by-step process and required data fields.' },
      { step: '02', label: 'SPRINT BUILD', desc: 'We build the software in modules and share progress on a private preview link.' },
      { step: '03', label: 'TEAM ONBOARDING', desc: 'We test with your real staff, fix edge cases, and deploy the system.' },
    ],
    quotationPath:
      'Scoped and priced based on required screens, user roles, data complexity, and integrations. Delivered under milestone-based payments.',
  },
  {
    number: '04',
    id: 'erp-support',
    title: 'ERP SETUP, IMPROVEMENT & SUPPORT',
    plainSummary:
      'Set up, improve or connect business software used to manage inventory, purchasing, sales, manufacturing and finance.',
    division: 'NEXORA',
    category: 'BUSINESS SYSTEMS',
    targetCustomer:
      'Trading companies, manufacturers, workshops, and growing businesses needing organized records across departments.',
    scopeOverview:
      'ERP (Enterprise Resource Planning) software helps a business track orders, stock, supplier purchases, and invoices in one connected database. We specialize in Frappe Framework and ERPNext, helping you configure, customize, or maintain your system cleanly.',
    deliverables: [
      'ERP installation and configuration suited to your operational workflow',
      'Custom forms and fields for your industry requirements',
      'Permission setup so staff only see what they need to see',
      'Automated document printing formats (invoices, purchase orders, delivery notes)',
      'Data import from legacy systems with data cleanup guidance',
      'Ongoing technical support, maintenance, and safe upgrades',
    ],
    process: [
      { step: '01', label: 'NEEDS REVIEW', desc: 'We review your buying, stock, sales, and accounting workflows.' },
      { step: '02', label: 'CONFIGURATION', desc: 'We configure modules, custom fields, print formats, and user permissions.' },
      { step: '03', label: 'GO-LIVE SUPPORT', desc: 'We verify numbers, train users, and provide hands-on assistance during launch.' },
    ],
    quotationPath:
      'Pricing depends on which modules you need (Sales, Stock, Buying, Accounts), custom form requirements, and data migration volume.',
  },
  {
    number: '05',
    id: 'crm-automation',
    title: 'CUSTOMER MANAGEMENT & AUTOMATION',
    plainSummary:
      'Keep track of new inquiries, customer conversations, and automated follow-ups so no opportunity slips away.',
    division: 'NEXORA',
    category: 'SALES & SUPPORT',
    targetCustomer:
      'Sales teams, consultants, service businesses, and agencies managing client inquiries across email, phone, and forms.',
    scopeOverview:
      'A CRM (Customer Relationship Management system) helps you track who reached out, what they asked for, and what needs to happen next. We set up pipelines that save your team hours of manual note-taking.',
    deliverables: [
      'Clear lead and deal pipeline with stages (New, Contacted, Proposal, Won)',
      'Automatic capture of inquiries from your website forms directly into the CRM',
      'Notification triggers sent to your team via email or messaging apps',
      'Organized customer history with past notes, quotes, and files',
      'Simple reports showing new leads and active deals',
      'Deduplication and contact hygiene setup',
    ],
    process: [
      { step: '01', label: 'LEAD REVIEW', desc: 'We see how leads currently arrive and where delays or lost information happen.' },
      { step: '02', label: 'PIPELINE SETUP', desc: 'We build your inquiry stages, fields, and automatic notifications.' },
      { step: '03', label: 'TESTING & HANDOVER', desc: 'We test forms with sample inquiries and guide your team on daily use.' },
    ],
    quotationPath:
      'Priced based on inquiry volume, the number of connected forms or channels, and automation complexity.',
  },
  {
    number: '06',
    id: 'connecting-systems',
    title: 'CONNECTING BUSINESS SYSTEMS & DASHBOARDS',
    plainSummary:
      'Connect separate software tools so data moves automatically, and build simple dashboards to monitor your key numbers.',
    division: 'NEXORA',
    category: 'INTEGRATIONS',
    targetCustomer:
      'Businesses using multiple software tools (accounting, spreadsheets, website, CRM) that need them to communicate without manual re-typing.',
    scopeOverview:
      'When your team spends hours copying customer details or orders from one program into another, we build direct software connections (APIs and webhooks) to transfer data automatically and accurately.',
    deliverables: [
      'Automated data syncing between your website, accounting, and operational tools',
      'Custom business dashboard displaying key operational numbers in one place',
      'Error notification alerts if a connection or third-party service fails',
      'Elimination of double-data entry and human copy-paste errors',
      'Documentation explaining how data moves between your systems',
    ],
    process: [
      { step: '01', label: 'SYSTEM INVENTORY', desc: 'We check which software tools have available connection points (APIs).' },
      { step: '02', label: 'INTEGRATION BUILD', desc: 'We write secure connection scripts with error handling.' },
      { step: '03', label: 'VERIFICATION', desc: 'We monitor live synchronization to verify data accuracy across systems.' },
    ],
    quotationPath:
      'Quoted based on the number of systems being connected and data transfer frequency.',
  },

  // --- ELEVORA (CAREER BRANDING & PORTFOLIOS) ---
  {
    number: '07',
    id: 'career-profile-resume',
    title: 'CAREER PROFILE & RESUME CREATION',
    plainSummary:
      'Present your experience, skills, education and achievements in a clear, professional format that is suited to the opportunities you want.',
    division: 'ELEVORA',
    category: 'RESUMES & CVS',
    targetCustomer:
      'Students, recent graduates, experienced professionals, career changers, and leaders who want a compelling, well-structured CV.',
    scopeOverview:
      'We work directly with you to turn your career history into a concise, professional resume. We make sure your genuine achievements stand out to hiring managers and that the layout works smoothly with hiring software (ATS) used by recruiters.',
    deliverables: [
      'One-to-one consultation to understand your career journey and target roles',
      'Carefully written and organized resume highlighting real accomplishments',
      'Layout structured for easy reading by both humans and employer screening systems (ATS)',
      '1-page concise version or full-length CV format depending on your field',
      'Clean editable source document (Word/Docs) and print-ready PDF',
      'Agreed revision allowance to refine wording until you are confident',
    ],
    process: [
      { step: '01', label: 'CAREER INTAKE', desc: 'We review your background, past roles, projects, and target positions.' },
      { step: '02', label: 'DRAFTING', desc: 'We organize your story into clear bullet points with measurable impact.' },
      { step: '03', label: 'FEEDBACK & POLISH', desc: 'You review the draft, request adjustments, and receive final files.' },
    ],
    quotationPath:
      'Priced simply by career stage: early career / graduates, experienced professionals, and senior management.',
  },
  {
    number: '08',
    id: 'personal-portfolios',
    title: 'PERSONAL PORTFOLIO WEBSITES',
    plainSummary:
      'Showcase your work, projects, skills and achievements through a personal website you can share with employers or clients.',
    division: 'ELEVORA',
    category: 'PORTFOLIOS',
    targetCustomer:
      'Designers, software developers, architects, consultants, photographers, researchers, and professionals who need to demonstrate proof of work.',
    scopeOverview:
      'A resume tells what you did; a portfolio website shows how you did it. We build clean, personalized websites where visitors can explore your case studies, download your CV, and contact you directly.',
    deliverables: [
      'Custom-designed personal website matching your style and discipline',
      'Project showcase pages with images, descriptions, and results',
      'About page with your professional biography and resume download link',
      'Direct contact form so interested parties can reach you immediately',
      'Mobile-tested responsive layout that looks great on any screen',
      'Custom domain setup (yourname.com) and secure hosting deployment',
    ],
    process: [
      { step: '01', label: 'PROJECT SELECTION', desc: 'We help you select your strongest work and outline each case study.' },
      { step: '02', label: 'SITE CREATION', desc: 'We build your personal site with your imagery, text, and contact links.' },
      { step: '03', label: 'LIVE LAUNCH', desc: 'We link your custom domain, test all pages, and hand over the site.' },
    ],
    quotationPath:
      'Based on the number of project case studies, custom design requests, and domain setup assistance.',
  },
  {
    number: '09',
    id: 'linkedin-improvement',
    title: 'LINKEDIN PROFILE IMPROVEMENT',
    plainSummary:
      'Make your professional profile clearer, more complete and better aligned with the work you want to pursue.',
    division: 'ELEVORA',
    category: 'ONLINE PRESENCE',
    targetCustomer:
      'Anyone looking to be discovered for job opportunities, consulting inquiries, speaking invitations, or professional networking.',
    scopeOverview:
      'We rewrite and polish your LinkedIn profile sections—from a headline that describes what you actually do, to an engaging About summary, clear experience entries, and advice on profile settings.',
    deliverables: [
      'Clear, professional headline that describes your role and focus',
      'Engaging About summary written in a natural, confident first-person voice',
      'Restructured experience entries highlighting responsibilities and outcomes',
      'Selection of relevant skills aligned with your target industry',
      'Branded profile banner graphic formatted for desktop and mobile',
      'Actionable checklist for managing recommendations and profile visibility',
    ],
    process: [
      { step: '01', label: 'PROFILE AUDIT', desc: 'We examine your current profile and compare it with roles you want to attract.' },
      { step: '02', label: 'REWRITE', desc: 'We write your new headline, summary, and experience descriptions.' },
      { step: '03', label: 'UPDATE', desc: 'We guide you through applying the text or update it directly with you.' },
    ],
    quotationPath:
      'Offered as a standalone service or bundled with our resume creation service at a combined rate.',
  },
  {
    number: '10',
    id: 'job-search-management',
    title: 'JOB SEARCH PROFILE SETUP & MANAGEMENT',
    plainSummary:
      'Get help setting up and maintaining relevant job portal profiles and organizing the information used in your applications.',
    division: 'ELEVORA',
    category: 'JOB PORTALS',
    targetCustomer:
      'Busy professionals and active job seekers who want consistent, well-presented profiles across major employment platforms.',
    scopeOverview:
      'Searching for opportunities often requires setting up accounts across multiple portals (e.g., Indeed, Glassdoor, industry job boards). We ensure your details, credentials, and summary are presented accurately and consistently across each site.',
    deliverables: [
      'Selection of relevant job portals suited to your industry and location',
      'Standardized text snippets for short bios, work history, and skills',
      'Profile setup and profile completion checklist across agreed portals',
      'A personal spreadsheet tracking your logins, target roles, and applications',
      'Guidance on setting up relevant email alerts for new job postings',
    ],
    process: [
      { step: '01', label: 'PORTAL SELECTION', desc: 'We identify which platforms are most active for your target field.' },
      { step: '02', label: 'PROFILE POPULATION', desc: 'We prepare the required text blocks and configure your profiles.' },
      { step: '03', label: 'TRACKER HANDOVER', desc: 'We deliver your application tracking sheet and alert setup guide.' },
    ],
    quotationPath:
      'Quoted based on the number of job portals to be configured.',
  },
  {
    number: '11',
    id: 'tailored-applications',
    title: 'TAILORED APPLICATIONS FOR SPECIFIC JOBS',
    plainSummary:
      'Adapt your genuine experience and application materials to the requirements of a specific role without inventing skills or achievements.',
    division: 'ELEVORA',
    category: 'TARGETED ROLES',
    targetCustomer:
      'Candidates applying for a specific dream role or high-priority opportunity who need their application to stand out clearly.',
    scopeOverview:
      'Sending a generic resume for every role often fails to address the employer’s specific needs. We analyze the job description and help you adapt your genuine background so your relevant experience is immediately obvious to the hiring team.',
    deliverables: [
      'Detailed comparison between the job posting and your background',
      'Tailored resume version emphasizing your most relevant projects and skills',
      'Targeted cover letter or introductory email addressing the hiring team directly',
      'Assistance preparing answers for common application form questions',
      'Review of your portfolio links to ensure relevant examples are front and centre',
    ],
    process: [
      { step: '01', label: 'JOB REVIEW', desc: 'You share the specific job description and company background.' },
      { step: '02', label: 'MATERIAL ADAPTATION', desc: 'We adapt your CV emphasis and draft a targeted cover letter.' },
      { step: '03', label: 'FINAL CHECK', desc: 'We do a final proofread together before you submit your application.' },
    ],
    quotationPath:
      'Priced per application package (tailored CV + targeted cover letter).',
  },
  {
    number: '12',
    id: 'document-updates',
    title: 'CAREER DOCUMENT UPDATES & REVISIONS',
    plainSummary:
      'Keep your career documents fresh with quick updates whenever you complete a new project, earn a certificate or change roles.',
    division: 'ELEVORA',
    category: 'UPDATES & REVIEWS',
    targetCustomer:
      'Past clients or professionals who already have a solid CV but need new achievements, promotions, or qualifications added.',
    scopeOverview:
      'You should not have to rewrite your entire resume from scratch just because you took on a new project or earned a new credential. We help you cleanly integrate new experience while keeping the overall document balanced and concise.',
    deliverables: [
      'Addition of new employment roles, certifications, or recent achievements',
      'Condensing of older experience to keep your document at an optimal length',
      'Format and typography refresh to keep styling modern and clean',
      'Updated PDF and editable source files ready to share',
    ],
    process: [
      { step: '01', label: 'SHARE UPDATES', desc: 'Send your existing CV and details of the new role or accomplishment.' },
      { step: '02', label: 'EDIT & REBALANCE', desc: 'We integrate the new information and rebalance formatting.' },
      { step: '03', label: 'FILE DELIVERY', desc: 'We deliver your refreshed, polished documents within agreed timing.' },
    ],
    quotationPath:
      'Flat fee per document refresh. Discounted for returning clients.',
  },
];

export function ServiceIndexSection() {
  const [filter, setFilter] = useState<'ALL' | 'NEXORA' | 'ELEVORA'>('ALL');
  const [activeId, setActiveId] = useState<string | null>('business-websites');

  const filteredServices = studioServices.filter(
    (s) => filter === 'ALL' || s.division === filter
  );

  const handleInquire = (service: ServiceDetail) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hopepitome-select-service', {
          detail: {
            division: service.division,
            serviceTitle: service.title,
          },
        })
      );
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="services" className="relative py-28 md:py-36 border-b border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase mb-3">
              <span className="text-[#8B6CFF] font-bold">04 //</span>
              <span className="text-warm-white">SERVICES &amp; WHAT WE OFFER</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-warm-white uppercase">
              EXPLORE OUR SERVICES
            </h2>
          </div>

          {/* Division Filter Pills */}
          <div className="flex items-center space-x-2 text-xs font-mono tracking-wider">
            {(['ALL', 'NEXORA', 'ELEVORA'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 uppercase transition-all border ${
                  filter === tab
                    ? 'border-[#8B6CFF] bg-[#8B6CFF]/20 text-white font-bold'
                    : 'border-white/10 text-muted-stone hover:text-warm-white hover:border-white/25'
                }`}
              >
                {tab === 'ALL' ? 'ALL SERVICES (12)' : tab === 'NEXORA' ? 'NEXORA (BUSINESS)' : 'ELEVORA (CAREER)'}
              </button>
            ))}
          </div>
        </div>

        {/* Numbered Interactive Accordion */}
        <div className="divide-y divide-white/[0.08] border-b border-white/[0.08]">
          {filteredServices.map((item) => {
            const isOpen = activeId === item.id;
            return (
              <div
                key={item.id}
                className={`group transition-all duration-300 ${
                  isOpen ? 'bg-[#101116]/60 backdrop-blur-md' : 'hover:bg-white/[0.01]'
                }`}
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => setActiveId(isOpen ? null : item.id)}
                  className="w-full py-6 px-2 sm:px-4 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 focus:outline-none focus-visible:bg-white/[0.03]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline space-x-5 lg:space-x-8">
                    <span className="font-mono text-sm md:text-base text-muted-stone group-hover:text-[#8B6CFF] transition-colors shrink-0">
                      {item.number}
                    </span>

                    <div>
                      <h3 className="font-display font-bold text-lg sm:text-2xl uppercase tracking-tight text-warm-white group-hover:text-[#E4DBFF] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-light font-sans normal-case mt-1 max-w-2xl">
                        {item.plainSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-start md:self-auto pl-10 md:pl-0">
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 border shrink-0 ${
                        item.division === 'NEXORA'
                          ? 'border-[#8B6CFF]/40 text-[#E4DBFF] bg-[#8B6CFF]/10'
                          : 'border-white/20 text-stone-light bg-white/5'
                      }`}
                    >
                      {item.division === 'NEXORA' ? 'BUSINESS' : 'CAREER'}
                    </span>

                    <span className="text-stone-light text-xs font-mono w-4 text-center">
                      {isOpen ? '—' : '+'}
                    </span>
                  </div>
                </button>

                {/* Expanded Full Drawer */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-8 pt-3 grid grid-cols-1 lg:grid-cols-12 gap-8 text-sm animate-in fade-in duration-200">
                    {/* Left: Audience, Detailed Scope & 3-Step Process */}
                    <div className="lg:col-span-7 space-y-5">
                      <div>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-1 font-bold">
                          WHO IS THIS FOR?
                        </span>
                        <p className="text-warm-white font-sans text-sm leading-relaxed">
                          {item.targetCustomer}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-1 font-bold">
                          WHAT WE DO
                        </span>
                        <p className="text-stone-light font-sans text-sm leading-relaxed">
                          {item.scopeOverview}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-2 font-bold">
                          HOW WE DELIVER THIS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {item.process.map((p) => (
                            <div
                              key={p.step}
                              className="p-3 bg-[#101116]/80 border border-white/[0.08] text-xs"
                            >
                              <div className="font-mono text-[10px] text-[#8B6CFF] mb-1 font-semibold">
                                STEP {p.step} — {p.label}
                              </div>
                              <p className="text-muted-stone text-[11px] leading-snug font-sans">
                                {p.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: What You Receive, Price Scoping & Direct Action */}
                    <div className="lg:col-span-5 lg:border-l lg:border-white/[0.08] lg:pl-8 flex flex-col justify-between space-y-5">
                      <div>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-2 font-bold">
                          WHAT YOU WILL RECEIVE
                        </span>
                        <ul className="space-y-2 text-xs font-mono text-muted-stone">
                          {item.deliverables.map((deliv, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-[#8B6CFF] text-[10px] mt-0.5">■</span>
                              <span className="text-stone-light normal-case font-sans text-xs">
                                {deliv}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                        <span className="text-[10px] font-mono text-warm-white uppercase tracking-wider block font-bold">
                          HOW QUOTATIONS &amp; TIMELINES WORK
                        </span>
                        <p className="text-xs text-muted-stone font-sans leading-relaxed">
                          {item.quotationPath}
                        </p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => handleInquire(item)}
                          className="w-full py-3.5 px-4 bg-white text-graphite-950 hover:bg-[#8B6CFF] hover:text-white transition-colors duration-200 font-mono text-xs tracking-wider uppercase font-bold flex items-center justify-center space-x-2"
                        >
                          <span>Ask about {item.title}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
