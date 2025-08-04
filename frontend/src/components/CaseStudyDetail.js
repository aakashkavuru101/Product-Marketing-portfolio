import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  Target, 
  TrendingUp, 
  DollarSign,
  Users,
  Calendar,
  Award,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { gtmAPI } from '../services/api';
import { 
  formatCurrency, 
  formatPercentage, 
  getCompanyTypeBadge, 
  getSuccessRateColor,
  formatNumber
} from '../utils/helpers';

const CaseStudyDetail = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCaseStudyData();
  }, [id]);

  const fetchCaseStudyData = async () => {
    try {
      setLoading(true);
      
      const [studyResponse, metricsResponse] = await Promise.all([
        gtmAPI.getCaseStudy(id),
        gtmAPI.getCaseMetrics(id)
      ]);

      setCaseStudy(studyResponse);
      setMetrics(metricsResponse.metrics || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching case study:', err);
      setError('Failed to load case study data');
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

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error || 'Case study not found'}</div>
          <Link to="/" className="btn-primary px-6 py-2 rounded-lg text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Chart data preparations
  const marketResearchData = [
    { name: 'TAM', value: parseFloat(caseStudy.market_research.total_addressable_market.replace(/[\$B]/g, '')) },
    { name: 'SAM', value: parseFloat(caseStudy.market_research.serviceable_addressable_market.replace(/[\$B]/g, '')) },
    { name: 'Target', value: parseFloat(caseStudy.market_research.target_segment_size.replace(/[\$B]/g, '')) }
  ];

  const channelData = caseStudy.channel_strategy.primary_channels.map(channel => ({
    name: channel.channel.replace(' Sales', '').replace(' Network', ''),
    value: parseInt(channel.contribution.replace('%', '')),
    focus: channel.focus
  }));

  const competitorData = caseStudy.competitive_analysis.direct_competitors.map(comp => ({
    name: comp.name.replace(' Business', '').replace(' Drive', 'Drive'),
    share: parseFloat(comp.market_share.replace('%', '')),
    weakness: comp.key_weakness
  }));

  const timelineData = caseStudy.execution_timeline.map((phase, index) => ({
    phase: phase.phase,
    duration: phase.duration,
    activities: phase.activities.length,
    order: index + 1
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getCompanyTypeBadge(caseStudy.company_type)}`}>
              {caseStudy.company_type.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">{caseStudy.company_name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-blue-100">
                  <Building className="h-5 w-5 mr-2" />
                  <span>{caseStudy.industry}</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <Target className="h-5 w-5 mr-2" />
                  <span>{caseStudy.product_category}</span>
                </div>
              </div>
              <p className="text-xl text-blue-100 leading-relaxed">
                {caseStudy.solution_overview}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-2">
                  <Award className="h-8 w-8 text-yellow-300" />
                  <div className={`text-right ${getSuccessRateColor(caseStudy.success_rate)} text-white`}>
                    <div className="text-3xl font-bold">{formatPercentage(caseStudy.success_rate)}</div>
                    <div className="text-sm text-blue-100">Success Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 text-green-300" />
                  <div className="text-right text-white">
                    <div className="text-2xl font-bold">{caseStudy.revenue_impact}</div>
                    <div className="text-sm text-blue-100">Revenue Impact</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Challenge & Solution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Challenge & Solution</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Challenge</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Solution</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {caseStudy.solution_overview}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Customer Acquisition Cost',
              value: formatCurrency(caseStudy.key_metrics.customer_acquisition_cost),
              icon: Target,
              color: 'text-blue-600',
              bg: 'bg-blue-50'
            },
            {
              title: 'Customer Lifetime Value',
              value: formatCurrency(caseStudy.key_metrics.customer_lifetime_value),
              icon: TrendingUp,
              color: 'text-green-600',
              bg: 'bg-green-50'
            },
            {
              title: 'LTV:CAC Ratio',
              value: `${caseStudy.key_metrics.ltv_cac_ratio}x`,
              icon: BarChart3,
              color: 'text-purple-600',
              bg: 'bg-purple-50'
            },
            {
              title: 'Churn Rate',
              value: formatPercentage(caseStudy.key_metrics.churn_rate),
              icon: Activity,
              color: 'text-orange-600',
              bg: 'bg-orange-50'
            }
          ].map((metric, index) => (
            <div key={metric.title} className={`${metric.bg} rounded-2xl p-6 border border-gray-100`}>
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.title}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Market Research Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-3 text-blue-500" />
              Market Opportunity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketResearchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}B`, 'Market Size']} />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Strategy */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-3 text-green-500" />
              Channel Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Execution Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-3 text-purple-500" />
            Execution Timeline
          </h3>
          <div className="space-y-6">
            {caseStudy.execution_timeline.map((phase, index) => (
              <div key={phase.phase} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{phase.phase}</h4>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {phase.duration}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {phase.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Analysis & Pricing Strategy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Competitive Analysis */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Competitive Landscape</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Our Positioning</h4>
                <p className="text-blue-800 text-sm">{caseStudy.competitive_analysis.positioning}</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Direct Competitors</h4>
                {caseStudy.competitive_analysis.direct_competitors.map((comp, index) => (
                  <div key={comp.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{comp.name}</div>
                      <div className="text-sm text-gray-600">Market Share: {comp.market_share}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Key Weakness</div>
                      <div className="text-sm text-gray-700">{comp.key_weakness}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Strategy */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing Strategy</h3>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Pricing Model</h4>
                <p className="text-green-800 text-sm">{caseStudy.pricing_strategy.model}</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Pricing Tiers</h4>
                {caseStudy.pricing_strategy.pricing_tiers.map((tier, index) => (
                  <div key={tier.name} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{tier.name}</div>
                      <div className="text-lg font-bold text-blue-600">{tier.price}</div>
                    </div>
                    <div className="text-sm text-gray-600">{tier.target}</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-sm text-yellow-800">
                  <strong>Psychology:</strong> {caseStudy.pricing_strategy.pricing_psychology}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;