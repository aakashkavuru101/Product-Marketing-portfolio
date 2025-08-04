import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Award, 
  DollarSign, 
  Users, 
  ArrowUpRight,
  Building,
  Rocket,
  Eye,
  ChevronRight,
  BarChart3,
  PieChart
} from 'lucide-react';
import { gtmAPI } from '../services/api';
import { 
  formatCurrency, 
  formatPercentage, 
  getCompanyTypeBadge, 
  getSuccessRateColor,
  truncateText,
  formatNumber
} from '../utils/helpers';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats and case studies in parallel
      const [statsResponse, studiesResponse] = await Promise.all([
        gtmAPI.getDashboardStats(),
        gtmAPI.getCaseStudies()
      ]);

      setDashboardStats(statsResponse);
      setCaseStudies(studiesResponse.case_studies || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary px-6 py-2 rounded-lg text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate total revenue impact from case studies
  const totalRevenueImpact = caseStudies.reduce((sum, study) => {
    const impact = study.revenue_impact.match(/\$(\d+(?:\.\d+)?)[MB]/);
    if (impact) {
      const value = parseFloat(impact[1]);
      const unit = impact[0].includes('M') ? 1000000 : 1000000000;
      return sum + (value * unit);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
              Product Marketing Portfolio
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Proven GTM strategies and frameworks with {formatCurrency(totalRevenueImpact, 'USD', 'compact')}+ revenue impact 
              and {formatPercentage(dashboardStats?.average_success_rate || 94.2)} success rate
            </p>
            <div className="flex justify-center space-x-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/frameworks" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105">
                View GTM Frameworks
              </Link>
              <a href="#case-studies" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                Explore Case Studies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Case Studies',
              value: dashboardStats?.total_case_studies || 0,
              icon: BarChart3,
              color: 'gradient-info',
              subtitle: `${dashboardStats?.startup_studies || 0} Startups, ${dashboardStats?.mnc_studies || 0} MNC`
            },
            {
              title: 'Average Success Rate',
              value: `${dashboardStats?.average_success_rate || 94.2}%`,
              icon: Award,
              color: 'gradient-success',
              subtitle: 'Across all campaigns'
            },
            {
              title: 'Revenue Impact',
              value: formatCurrency(totalRevenueImpact, 'USD', 'compact'),
              icon: DollarSign,
              color: 'gradient-warning',
              subtitle: 'Total generated revenue'
            },
            {
              title: 'GTM Frameworks',
              value: '1',
              icon: Target,
              color: 'bg-gradient-to-r from-purple-500 to-pink-500',
              subtitle: '90%+ success rate'
            }
          ].map((stat, index) => (
            <div key={stat.title} className={`${stat.color} rounded-2xl p-6 text-white card-hover animate-fade-in-up`} style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white text-opacity-80">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-white text-opacity-70 mt-2">{stat.subtitle}</p>
                </div>
                <stat.icon className="h-8 w-8 text-white text-opacity-80" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Studies Section */}
      <section id="case-studies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Case Studies</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deep-dive analysis of successful GTM strategies across different industries and company types
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div key={study.id} className={`bg-white rounded-2xl shadow-lg border border-gray-200 card-hover animate-slide-in-${index % 2 === 0 ? 'left' : 'right'}`} style={{ animationDelay: `${0.8 + index * 0.2}s` }}>
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCompanyTypeBadge(study.company_type)}`}>
                    {study.company_type.toUpperCase()}
                  </span>
                  <div className={`text-right ${getSuccessRateColor(study.success_rate)}`}>
                    <div className="text-2xl font-bold">{formatPercentage(study.success_rate)}</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{study.company_name}</h3>
                <p className="text-gray-600 text-sm">{study.industry} • {study.product_category}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {truncateText(study.challenge, 120)}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Revenue Impact</div>
                    <div className="text-lg font-bold text-gray-900">{study.revenue_impact}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">LTV:CAC Ratio</div>
                    <div className="text-lg font-bold text-gray-900">{study.key_metrics?.ltv_cac_ratio || 'N/A'}</div>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Highlights</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="h-4 w-4 text-blue-500 mr-2" />
                      <span>CAC: {formatCurrency(study.key_metrics?.customer_acquisition_cost || 0)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      <span>MRR: {formatCurrency(study.key_metrics?.monthly_recurring_revenue || 0, 'USD', 'compact')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 text-purple-500 mr-2" />
                      <span>Churn Rate: {formatPercentage(study.key_metrics?.churn_rate || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link 
                  to={`/case-study/${study.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center group"
                >
                  View Detailed Analysis
                  <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Implement These Strategies?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our proven GTM frameworks and detailed case study breakdowns to accelerate your product marketing success
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/frameworks" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
              >
                <Target className="h-5 w-5 mr-2" />
                Explore Frameworks
              </Link>
              <button className="border border-gray-300 hover:bg-gray-100 hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;