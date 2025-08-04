import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Award, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Users,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Zap,
  Download,
  Share2
} from 'lucide-react';
import { gtmAPI } from '../services/api';
import { formatPercentage } from '../utils/helpers';

const Frameworks = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(null);

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    try {
      setLoading(true);
      const response = await gtmAPI.getFrameworks();
      setFrameworks(response.frameworks || []);
      if (response.frameworks && response.frameworks.length > 0) {
        setSelectedFramework(response.frameworks[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching frameworks:', err);
      setError('Failed to load GTM frameworks');
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
            onClick={fetchFrameworks}
            className="btn-primary px-6 py-2 rounded-lg text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const phaseIcons = [
    { icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Zap, color: 'text-green-500', bg: 'bg-green-50' },
    { icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
              High-Velocity GTM Frameworks
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Proven methodologies and strategies with 90%+ success rates across B2B SaaS launches, 
              enterprise rollouts, and technology product introductions
            </p>
            <div className="flex justify-center space-x-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Download Framework
              </button>
              <Link to="/" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                View Case Studies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Success Rate',
              value: '94.2%',
              icon: Award,
              description: 'Average across all implementations',
              color: 'gradient-success'
            },
            {
              title: 'Time to Market',
              value: '60% Faster',
              icon: Clock,
              description: 'Compared to traditional approaches',
              color: 'gradient-warning'
            },
            {
              title: 'Revenue Impact',
              value: '$150M+',
              icon: BarChart3,
              description: 'Total generated across case studies',
              color: 'gradient-info'
            }
          ].map((stat, index) => (
            <div key={stat.title} className={`${stat.color} rounded-2xl p-6 text-white card-hover animate-fade-in-up`} style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white text-opacity-80">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-white text-opacity-70 mt-2">{stat.description}</p>
                </div>
                <stat.icon className="h-8 w-8 text-white text-opacity-80" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Overview */}
      {selectedFramework && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Framework Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-4">{selectedFramework.name}</h2>
                  <p className="text-gray-300 text-lg max-w-3xl">{selectedFramework.description}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400">{formatPercentage(selectedFramework.success_rate)}</div>
                  <div className="text-sm text-gray-300">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ideal Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedFramework.use_cases.map((useCase, index) => (
                  <div key={useCase} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                    <Target className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-blue-800 font-medium">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Framework Phases */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Framework Phases</h3>
              <div className="space-y-8">
                {selectedFramework.phases.map((phase, index) => {
                  const IconComponent = phaseIcons[index]?.icon || CheckCircle;
                  const iconColor = phaseIcons[index]?.color || 'text-gray-500';
                  const iconBg = phaseIcons[index]?.bg || 'bg-gray-50';

                  return (
                    <div key={phase.phase_name} className="relative">
                      {/* Phase Number & Icon */}
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center border border-gray-200`}>
                            <IconComponent className={`h-8 w-8 ${iconColor}`} />
                          </div>
                          <div className="text-center mt-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Phase {index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Phase Content */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-2xl font-bold text-gray-900">{phase.phase_name}</h4>
                            <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                              Duration: {phase.duration}
                            </span>
                          </div>

                          {/* Activities */}
                          <div className="mb-6">
                            <h5 className="text-lg font-semibold text-gray-800 mb-3">Key Activities</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {phase.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Deliverables */}
                          <div className="mb-6">
                            <h5 className="text-lg font-semibold text-gray-800 mb-3">Key Deliverables</h5>
                            <div className="flex flex-wrap gap-2">
                              {phase.key_deliverables.map((deliverable, delIndex) => (
                                <span 
                                  key={delIndex}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                                >
                                  {deliverable}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Success Metrics */}
                          <div>
                            <h5 className="text-lg font-semibold text-gray-800 mb-3">Success Metrics</h5>
                            <div className="flex flex-wrap gap-2">
                              {phase.success_metrics.map((metric, metIndex) => (
                                <span 
                                  key={metIndex}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
                                >
                                  {metric}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connector Line */}
                      {index < selectedFramework.phases.length - 1 && (
                        <div className="absolute left-8 top-20 w-px h-16 bg-gradient-to-b from-gray-300 to-transparent"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Implementation Guide */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Implement?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with our proven framework and join the ranks of successful product marketers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Download Framework',
                description: 'Get the complete framework template with all phases, activities, and deliverables',
                icon: Download,
                color: 'text-blue-500',
                bg: 'bg-blue-50'
              },
              {
                step: '02', 
                title: 'Customize for Your Market',
                description: 'Adapt the framework to your specific industry, product, and market conditions',
                icon: Target,
                color: 'text-green-500',
                bg: 'bg-green-50'
              },
              {
                step: '03',
                title: 'Execute & Monitor',
                description: 'Implement the framework phases while tracking success metrics and KPIs',
                icon: TrendingUp,
                color: 'text-purple-500',
                bg: 'bg-purple-50'
              }
            ].map((step, index) => (
              <div key={step.step} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 card-hover">
                <div className={`w-12 h-12 ${step.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="text-sm text-gray-500 font-semibold mb-2">STEP {step.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center mx-auto group">
              <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Download Complete Framework
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Join 500+ product marketers who have successfully implemented this framework
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <blockquote className="text-2xl font-medium mb-8">
              "This framework transformed our GTM approach. We achieved 94% success rate and reduced 
              time-to-market by 60% across our last 3 product launches."
            </blockquote>
            <div className="flex justify-center items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Product Marketing Team</div>
                <div className="text-gray-300">Fortune 500 SaaS Company</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Frameworks;