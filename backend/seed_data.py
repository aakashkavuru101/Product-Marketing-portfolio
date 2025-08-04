#!/usr/bin/env python3

import os
from pymongo import MongoClient
from datetime import datetime
import uuid

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/gtm_portfolio_db")
client = MongoClient(MONGO_URL)
db = client.gtm_portfolio_db

# Clear existing data
print("Clearing existing data...")
db.case_studies.delete_many({})
db.frameworks.delete_many({})
db.metrics.delete_many({})

# GTM Case Studies Data
case_studies = [
    {
        "id": str(uuid.uuid4()),
        "company_name": "CloudSync Pro",
        "company_type": "startup",
        "industry": "SaaS/Cloud Storage",
        "product_category": "B2B Cloud Solutions",
        "challenge": "Zero brand recognition in saturated market dominated by Google Drive, Dropbox, and OneDrive",
        "solution_overview": "Implemented focused GTM strategy targeting mid-market enterprises with compliance-heavy requirements",
        "market_research": {
            "total_addressable_market": "$47.2B",
            "serviceable_addressable_market": "$12.8B",
            "target_segment_size": "$2.1B",
            "key_insights": [
                "68% of mid-market enterprises struggle with compliance in major cloud providers",
                "Average switching cost tolerance: $25K-50K annually",
                "Decision timeline: 3-6 months with 4-7 stakeholders"
            ],
            "primary_research_methods": ["Customer interviews (247 respondents)", "Competitive analysis", "Market surveys"]
        },
        "competitive_analysis": {
            "direct_competitors": [
                {"name": "Google Drive Business", "market_share": "34%", "key_weakness": "Limited compliance features"},
                {"name": "Dropbox Business", "market_share": "22%", "key_weakness": "High enterprise pricing"},
                {"name": "OneDrive", "market_share": "28%", "key_weakness": "Complex integration"}
            ],
            "competitive_advantage": "First-to-market compliance-first cloud storage with automated audit trails",
            "positioning": "The only cloud storage solution built specifically for compliance-heavy industries"
        },
        "pricing_strategy": {
            "model": "Tiered SaaS with usage-based scaling",
            "pricing_tiers": [
                {"name": "Compliance Starter", "price": "$12/user/month", "target": "Small teams (5-25 users)"},
                {"name": "Compliance Pro", "price": "$28/user/month", "target": "Mid-market (25-250 users)"},
                {"name": "Enterprise", "price": "Custom", "target": "Large organizations (250+ users)"}
            ],
            "pricing_psychology": "Positioned at 15% premium to justify superior compliance features",
            "discount_strategy": "Annual contracts: 20% discount, Multi-year: 35% discount"
        },
        "channel_strategy": {
            "primary_channels": [
                {"channel": "Direct Sales", "contribution": "65%", "focus": "Enterprise deals >$50K ARR"},
                {"channel": "Partner Network", "contribution": "25%", "focus": "Compliance consultants and legal firms"},
                {"channel": "Inbound Marketing", "contribution": "10%", "focus": "Content-driven lead generation"}
            ],
            "sales_methodology": "MEDDIC with compliance-specific discovery",
            "average_sales_cycle": "4.2 months",
            "conversion_rates": {"MQL to SQL": "28%", "SQL to Opportunity": "42%", "Opportunity to Close": "31%"}
        },
        "execution_timeline": [
            {"phase": "Pre-Launch", "duration": "3 months", "activities": ["Market research", "MVP development", "Initial team hiring"]},
            {"phase": "Beta Launch", "duration": "2 months", "activities": ["Beta customer acquisition", "Product refinement", "Sales process optimization"]},
            {"phase": "Market Entry", "duration": "6 months", "activities": ["Full product launch", "Channel partner recruitment", "Content marketing ramp-up"]},
            {"phase": "Scale & Optimize", "duration": "Ongoing", "activities": ["Performance optimization", "Market expansion", "Feature development"]}
        ],
        "key_metrics": {
            "customer_acquisition_cost": "$2,847",
            "customer_lifetime_value": "$28,450",
            "ltv_cac_ratio": "10.0x",
            "monthly_recurring_revenue": "$847K",
            "churn_rate": "3.2%",
            "net_revenue_retention": "118%",
            "time_to_value": "14 days",
            "monthly_active_users": 12450
        },
        "success_rate": 94.2,
        "revenue_impact": "$18.7M ARR in 18 months",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": str(uuid.uuid4()),
        "company_name": "EcoLogistics",
        "company_type": "startup", 
        "industry": "GreenTech/Logistics",
        "product_category": "Sustainable Supply Chain",
        "challenge": "Convincing traditional logistics companies to adopt expensive green technology with uncertain ROI",
        "solution_overview": "Positioned as cost-saving solution first, sustainability second with guaranteed ROI framework",
        "market_research": {
            "total_addressable_market": "$31.8B",
            "serviceable_addressable_market": "$8.4B",
            "target_segment_size": "$1.9B",
            "key_insights": [
                "73% of logistics companies face increasing pressure for sustainability reporting",
                "Average fuel cost represents 35-40% of operational expenses",
                "90% prioritize cost savings over environmental benefits initially"
            ],
            "primary_research_methods": ["Industry surveys (180 companies)", "Cost-benefit analysis", "Pilot programs"]
        },
        "competitive_analysis": {
            "direct_competitors": [
                {"name": "Traditional logistics software", "market_share": "67%", "key_weakness": "No sustainability tracking"},
                {"name": "GreenFleet Systems", "market_share": "8%", "key_weakness": "High implementation cost"},
                {"name": "EcoTrack Pro", "market_share": "5%", "key_weakness": "Limited integration capabilities"}
            ],
            "competitive_advantage": "Only solution combining cost optimization with sustainability metrics and guaranteed ROI",
            "positioning": "Turn sustainability compliance into profit center"
        },
        "pricing_strategy": {
            "model": "Performance-based pricing with success fees",
            "pricing_tiers": [
                {"name": "Efficiency Starter", "price": "$0.08/shipment", "target": "Small logistics companies"},
                {"name": "Optimization Suite", "price": "$0.12/shipment + 15% of savings", "target": "Mid-market companies"},
                {"name": "Enterprise Green", "price": "Custom performance model", "target": "Large logistics providers"}
            ],
            "pricing_psychology": "Risk-free trial with money-back guarantee if ROI targets not met",
            "discount_strategy": "Volume discounts based on shipment volume, early adopter incentives"
        },
        "channel_strategy": {
            "primary_channels": [
                {"channel": "Direct Enterprise Sales", "contribution": "45%", "focus": "Large logistics companies"},
                {"channel": "Industry Partnership", "contribution": "35%", "focus": "Logistics associations and consultants"},
                {"channel": "Referral Program", "contribution": "20%", "focus": "Customer-driven growth"}
            ],
            "sales_methodology": "ROI-focused consultative selling with pilot programs",
            "average_sales_cycle": "6.8 months",
            "conversion_rates": {"Pilot to Paid": "67%", "Demo to Pilot": "34%", "Lead to Demo": "18%"}
        },
        "execution_timeline": [
            {"phase": "Research & Development", "duration": "4 months", "activities": ["Market research", "Technology development", "Pilot partner identification"]},
            {"phase": "Pilot Program", "duration": "3 months", "activities": ["Beta testing with 12 companies", "ROI validation", "Case study development"]},
            {"phase": "Commercial Launch", "duration": "6 months", "activities": ["Sales team build-out", "Marketing campaign launch", "Partnership development"]},
            {"phase": "Market Penetration", "duration": "Ongoing", "activities": ["Geographic expansion", "Feature enhancement", "Industry vertical expansion"]}
        ],
        "key_metrics": {
            "customer_acquisition_cost": "$4,290",
            "customer_lifetime_value": "$42,150",
            "ltv_cac_ratio": "9.8x",
            "monthly_recurring_revenue": "$524K",
            "churn_rate": "2.8%",
            "net_revenue_retention": "142%",
            "average_roi_delivered": "312%",
            "customers_with_positive_roi": "97%"
        },
        "success_rate": 96.7,
        "revenue_impact": "$23.4M ARR within 24 months",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": str(uuid.uuid4()),
        "company_name": "Global Enterprise Solutions (GES)",
        "company_type": "mnc",
        "industry": "Enterprise Software",
        "product_category": "AI-Powered Analytics Platform",
        "challenge": "Launching new AI analytics product in mature market against established competitors with 10x larger marketing budgets",
        "solution_overview": "David vs Goliath strategy focusing on specific use cases where incumbents were weak, leveraging existing customer relationships",
        "market_research": {
            "total_addressable_market": "$127.6B",
            "serviceable_addressable_market": "$34.2B", 
            "target_segment_size": "$8.9B",
            "key_insights": [
                "89% of enterprises report dissatisfaction with current analytics tools' AI capabilities",
                "Average implementation time for competing solutions: 8-12 months vs our 6-8 weeks",
                "62% of decision makers are existing GES customers in other product lines"
            ],
            "primary_research_methods": ["Customer advisory board (45 enterprise customers)", "Competitive intelligence", "Third-party research partnerships"]
        },
        "competitive_analysis": {
            "direct_competitors": [
                {"name": "Tableau", "market_share": "31%", "key_weakness": "Limited real-time AI predictions"},
                {"name": "Power BI", "market_share": "28%", "key_weakness": "Complex setup for advanced analytics"}, 
                {"name": "Qlik Sense", "market_share": "15%", "key_weakness": "Expensive scaling costs"}
            ],
            "competitive_advantage": "Only platform offering plug-and-play AI analytics with enterprise-grade security and existing system integration",
            "positioning": "AI analytics that works out-of-the-box for enterprise customers"
        },
        "pricing_strategy": {
            "model": "Seat-based subscription with AI usage tiers",
            "pricing_tiers": [
                {"name": "Analytics Pro", "price": "$89/user/month", "target": "Standard business intelligence users"},
                {"name": "AI Insights", "price": "$179/user/month", "target": "Advanced analytics with AI features"},
                {"name": "Enterprise AI", "price": "Custom (avg $450/user/month)", "target": "Full AI suite with custom models"}
            ],
            "pricing_psychology": "Positioned as premium solution with 'time-to-value' justification",
            "discount_strategy": "Enterprise agreements: up to 40% discount for 1000+ seats, existing customer cross-sell discounts"
        },
        "channel_strategy": {
            "primary_channels": [
                {"channel": "Direct Enterprise Sales", "contribution": "55%", "focus": "Fortune 1000 accounts"},
                {"channel": "Existing Customer Cross-sell", "contribution": "30%", "focus": "Current GES product users"},
                {"channel": "System Integrator Partners", "contribution": "15%", "focus": "Implementation partners"}
            ],
            "sales_methodology": "Solution selling with AI ROI calculators and proof-of-concept programs",
            "average_sales_cycle": "8.3 months",
            "conversion_rates": {"POC to Purchase": "74%", "Qualified Opportunity to POC": "45%", "Lead to Qualified Opp": "22%"}
        },
        "execution_timeline": [
            {"phase": "Strategic Planning", "duration": "2 months", "activities": ["Competitive intelligence", "Customer research", "GTM team assembly"]},
            {"phase": "Product Positioning", "duration": "3 months", "activities": ["Messaging development", "Sales enablement", "Proof-of-concept development"]},
            {"phase": "Market Launch", "duration": "4 months", "activities": ["Customer advisory program", "Industry analyst briefings", "Sales team training"]},
            {"phase": "Scale & Expansion", "duration": "Ongoing", "activities": ["Market penetration", "Geographic expansion", "Vertical specialization"]}
        ],
        "key_metrics": {
            "customer_acquisition_cost": "$18,450",
            "customer_lifetime_value": "$347,200",
            "ltv_cac_ratio": "18.8x",
            "annual_recurring_revenue": "$142M",
            "churn_rate": "4.1%",
            "net_revenue_retention": "134%",
            "average_deal_size": "$287K",
            "sales_cycle_acceleration": "35% faster than industry average"
        },
        "success_rate": 91.8,
        "revenue_impact": "$142M ARR with 67% market share in target segment",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

# GTM Framework Data
frameworks = [
    {
        "id": str(uuid.uuid4()),
        "name": "High-Velocity GTM Framework",
        "description": "Proven 90%+ success rate framework for B2B SaaS market entry and scaling",
        "phases": [
            {
                "phase_name": "Market Intelligence & Positioning",
                "duration": "4-6 weeks",
                "activities": [
                    "Total Addressable Market (TAM) analysis",
                    "Competitive landscape mapping",
                    "Ideal Customer Profile (ICP) definition",
                    "Value proposition development",
                    "Pricing strategy optimization"
                ],
                "key_deliverables": ["Market sizing report", "Competitive analysis", "ICP documentation", "Pricing model"],
                "success_metrics": ["Market size validation", "Competitive differentiation score", "ICP confidence level"]
            },
            {
                "phase_name": "Channel Strategy & Sales Enablement",
                "duration": "6-8 weeks", 
                "activities": [
                    "Channel partner identification",
                    "Sales methodology selection",
                    "Sales process optimization",
                    "Sales team training & enablement",
                    "Lead generation strategy"
                ],
                "key_deliverables": ["Channel strategy", "Sales playbook", "Training materials", "Lead gen plan"],
                "success_metrics": ["Channel partner commitment", "Sales team readiness score", "Lead generation targets"]
            },
            {
                "phase_name": "Launch & Market Penetration",
                "duration": "3-4 months",
                "activities": [
                    "Product launch execution",
                    "Marketing campaign deployment", 
                    "Sales pipeline development",
                    "Customer success program initiation",
                    "Performance monitoring & optimization"
                ],
                "key_deliverables": ["Launch plan", "Marketing campaigns", "Sales pipeline", "Success metrics dashboard"],
                "success_metrics": ["Launch targets achievement", "Pipeline velocity", "Customer acquisition rate"]
            },
            {
                "phase_name": "Scale & Optimize",
                "duration": "Ongoing",
                "activities": [
                    "Performance analysis & optimization",
                    "Market expansion strategy",
                    "Product-market fit refinement",
                    "Revenue operations scaling",
                    "Customer success optimization"
                ],
                "key_deliverables": ["Performance reports", "Expansion strategy", "Optimization roadmap"],
                "success_metrics": ["Revenue growth rate", "Market share growth", "Customer satisfaction scores"]
            }
        ],
        "success_rate": 94.2,
        "use_cases": ["B2B SaaS launches", "Enterprise software rollouts", "Technology product launches"],
        "created_at": datetime.now()
    }
]

# Sample Metrics Data
sample_case_id = case_studies[0]["id"]
metrics = [
    {
        "id": str(uuid.uuid4()),
        "case_study_id": sample_case_id,
        "metric_name": "Customer Acquisition Cost",
        "metric_value": 2847.0,
        "metric_unit": "USD",
        "time_period": "Q4 2023",
        "category": "market"
    },
    {
        "id": str(uuid.uuid4()),
        "case_study_id": sample_case_id,
        "metric_name": "Monthly Recurring Revenue",
        "metric_value": 847000.0,
        "metric_unit": "USD",
        "time_period": "December 2023",
        "category": "revenue"
    },
    {
        "id": str(uuid.uuid4()),
        "case_study_id": sample_case_id,
        "metric_name": "Customer Lifetime Value",
        "metric_value": 28450.0,
        "metric_unit": "USD", 
        "time_period": "Q4 2023",
        "category": "revenue"
    }
]

# Insert data into MongoDB
print("Inserting case studies...")
db.case_studies.insert_many(case_studies)
print(f"Inserted {len(case_studies)} case studies")

print("Inserting frameworks...")
db.frameworks.insert_many(frameworks)
print(f"Inserted {len(frameworks)} frameworks")

print("Inserting metrics...")
db.metrics.insert_many(metrics)
print(f"Inserted {len(metrics)} metrics")

print("Data seeding completed successfully!")