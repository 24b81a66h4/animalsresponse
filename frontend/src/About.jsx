import React from 'react';
import { Link } from 'react-router-dom';

const team = [
    {
        name: 'Animal Rescue Coordinators',
        role: 'Field Operations',
        desc: 'Dedicated volunteers who coordinate on-ground rescue efforts and ensure every report receives a timely response.',
        icon: '🦺',
    },
    {
        name: 'NGO Partners',
        role: 'Rescue & Rehabilitation',
        desc: 'Registered non-profits and animal welfare organisations that act on complaints and provide medical care.',
        icon: '🏥',
    },
    {
        name: 'Tech Team',
        role: 'Platform & Development',
        desc: 'Engineers who built and maintain WildGuard to make animal reporting seamless and accessible to everyone.',
        icon: '💻',
    },
];

const stats = [
    { label: 'Animals Rescued',   value: '2,400+' },
    { label: 'Active NGOs',       value: '38'     },
    { label: 'Cities Covered',    value: '12'     },
    { label: 'Reports Resolved',  value: '91%'    },
];

const About = () => {
    return (
        <div className="min-h-screen bg-stone-50">

            {/* Hero */}
            <section className="bg-emerald-900 relative overflow-hidden py-20">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon fill="currentColor" points="0,100 100,0 100,100" className="text-emerald-700" />
                    </svg>
                </div>
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <span className="text-5xl">🐾</span>
                    <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
                        About WildGuard
                    </h1>
                    <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                        We believe every animal deserves protection. WildGuard bridges the gap between
                        concerned citizens and the NGOs who can help — making rescue faster, transparent,
                        and community-driven.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-emerald-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            WildGuard was built out of frustration with the broken chain between someone who
                            spots an injured animal and the organisations equipped to help. Phone calls go
                            unanswered. WhatsApp messages get lost. Animals suffer.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Our platform gives every citizen a simple way to report an animal in distress —
                            with photos, location, and priority level — and routes it directly to verified NGOs
                            in the area. Every report is tracked until resolution.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We are not a rescue organisation ourselves. We are the infrastructure that makes
                            rescue organisations faster, accountable, and connected to the communities they serve.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map(s => (
                            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
                                <p className="text-3xl font-extrabold text-emerald-700">{s.value}</p>
                                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-emerald-50 py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-emerald-900 text-center mb-12">
                        How it works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'You report',
                                desc: 'Spot an animal in trouble? Submit a report with a photo, description, and your location in under 2 minutes.',
                                color: 'bg-amber-100 text-amber-700',
                            },
                            {
                                step: '02',
                                title: 'NGO responds',
                                desc: 'Verified local NGOs are notified instantly. They accept and assign the case, then update the status as they act.',
                                color: 'bg-emerald-100 text-emerald-700',
                            },
                            {
                                step: '03',
                                title: 'You track',
                                desc: 'Follow your report from Pending through to Resolved. Rate the response and help us improve the system.',
                                color: 'bg-purple-100 text-purple-700',
                            },
                        ].map(item => (
                            <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${item.color}`}>
                                    Step {item.step}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-extrabold text-emerald-900 text-center mb-12">
                    Who makes this happen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map(member => (
                        <div key={member.name} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">{member.icon}</div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                            <p className="text-emerald-600 text-sm font-medium mb-3">{member.role}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="bg-emerald-900 py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-white text-center mb-12">Our values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: '🔍', title: 'Transparency', desc: 'Every report is visible. Every status update is logged. There are no black holes in our system.' },
                            { icon: '⚡', title: 'Speed', desc: 'Animals cannot wait. We are designed for urgency — mobile-first, instant notifications, zero friction reporting.' },
                            { icon: '🤝', title: 'Community', desc: 'Rescue is a collective act. We connect citizens, NGOs, and administrators into one coordinated network.' },
                            { icon: '📊', title: 'Accountability', desc: 'NGOs are rated. Admins track resolution times. We use data to keep everyone honest and improve outcomes.' },
                        ].map(v => (
                            <div key={v.title} className="flex gap-4 bg-emerald-800/50 rounded-2xl p-5">
                                <span className="text-2xl flex-shrink-0">{v.icon}</span>
                                <div>
                                    <h3 className="font-bold text-white mb-1">{v.title}</h3>
                                    <p className="text-emerald-200 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center bg-stone-50">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ready to make a difference?</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Join thousands of citizens already using WildGuard to protect animals in their communities.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/register"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold shadow-md transition hover:scale-105 transform"
                    >
                        Get started
                    </Link>
                    <Link
                        to="/"
                        className="bg-white hover:bg-gray-50 text-emerald-800 border border-emerald-200 px-8 py-3 rounded-full font-bold shadow-sm transition"
                    >
                        View reports
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;