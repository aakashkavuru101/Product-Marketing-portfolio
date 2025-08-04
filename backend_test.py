#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for GTM Strategy Portfolio
Tests all critical API endpoints with data validation and business logic verification
"""

import requests
import json
import time
from typing import Dict, List, Any
import sys

# Configuration
BASE_URL = "http://localhost:8001"
API_BASE = f"{BASE_URL}/api"

class GTMBackendTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name: str, passed: bool, message: str = "", data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "message": message,
            "data": data
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ {test_name}: {message}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ {test_name}: {message}")
            
    def test_server_health(self):
        """Test if server is running and accessible"""
        try:
            response = requests.get(BASE_URL, timeout=10)
            if response.status_code == 200:
                self.log_test("Server Health Check", True, "Server is running and accessible")
                return True
            else:
                self.log_test("Server Health Check", False, f"Server returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Server Health Check", False, f"Server not accessible: {str(e)}")
            return False
    
    def test_dashboard_stats(self):
        """Test GET /api/dashboard-stats endpoint"""
        try:
            response = requests.get(f"{API_BASE}/dashboard-stats", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Dashboard Stats API", False, f"HTTP {response.status_code}: {response.text}")
                return
                
            data = response.json()
            
            # Validate required fields
            required_fields = ["total_case_studies", "startup_studies", "mnc_studies", "average_success_rate"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                self.log_test("Dashboard Stats API", False, f"Missing fields: {missing_fields}")
                return
                
            # Validate data types and ranges
            if not isinstance(data["total_case_studies"], int) or data["total_case_studies"] < 0:
                self.log_test("Dashboard Stats API", False, "Invalid total_case_studies value")
                return
                
            if not isinstance(data["startup_studies"], int) or data["startup_studies"] < 0:
                self.log_test("Dashboard Stats API", False, "Invalid startup_studies value")
                return
                
            if not isinstance(data["mnc_studies"], int) or data["mnc_studies"] < 0:
                self.log_test("Dashboard Stats API", False, "Invalid mnc_studies value")
                return
                
            # Validate success rate is between 90-100% as per requirements
            success_rate = data["average_success_rate"]
            if not isinstance(success_rate, (int, float)) or success_rate < 90 or success_rate > 100:
                self.log_test("Dashboard Stats API", False, f"Success rate {success_rate}% not in required range 90-100%")
                return
                
            # Validate business logic: startup + mnc should equal total
            if data["startup_studies"] + data["mnc_studies"] != data["total_case_studies"]:
                self.log_test("Dashboard Stats API", False, "Startup + MNC studies don't equal total studies")
                return
                
            # Validate expected counts (2 startups, 1 MNC as per requirements)
            if data["total_case_studies"] != 3:
                self.log_test("Dashboard Stats API", False, f"Expected 3 total case studies, got {data['total_case_studies']}")
                return
                
            if data["startup_studies"] != 2:
                self.log_test("Dashboard Stats API", False, f"Expected 2 startup studies, got {data['startup_studies']}")
                return
                
            if data["mnc_studies"] != 1:
                self.log_test("Dashboard Stats API", False, f"Expected 1 MNC study, got {data['mnc_studies']}")
                return
                
            self.log_test("Dashboard Stats API", True, f"All validations passed. Success rate: {success_rate}%", data)
            
        except requests.exceptions.RequestException as e:
            self.log_test("Dashboard Stats API", False, f"Request failed: {str(e)}")
        except json.JSONDecodeError as e:
            self.log_test("Dashboard Stats API", False, f"Invalid JSON response: {str(e)}")
        except Exception as e:
            self.log_test("Dashboard Stats API", False, f"Unexpected error: {str(e)}")
    
    def test_case_studies_list(self):
        """Test GET /api/case-studies endpoint"""
        try:
            response = requests.get(f"{API_BASE}/case-studies", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Case Studies List API", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
            data = response.json()
            
            if "case_studies" not in data:
                self.log_test("Case Studies List API", False, "Missing 'case_studies' field in response")
                return None
                
            case_studies = data["case_studies"]
            
            if not isinstance(case_studies, list):
                self.log_test("Case Studies List API", False, "case_studies should be a list")
                return None
                
            # Validate expected count (3 case studies)
            if len(case_studies) != 3:
                self.log_test("Case Studies List API", False, f"Expected 3 case studies, got {len(case_studies)}")
                return None
                
            # Validate each case study structure
            required_fields = ["id", "company_name", "company_type", "industry", "success_rate", "revenue_impact", "key_metrics"]
            
            startup_count = 0
            mnc_count = 0
            total_revenue_impact = 0
            
            for i, study in enumerate(case_studies):
                # Check required fields
                missing_fields = [field for field in required_fields if field not in study]
                if missing_fields:
                    self.log_test("Case Studies List API", False, f"Case study {i} missing fields: {missing_fields}")
                    return None
                    
                # Validate company type
                if study["company_type"] not in ["startup", "mnc"]:
                    self.log_test("Case Studies List API", False, f"Invalid company_type: {study['company_type']}")
                    return None
                    
                if study["company_type"] == "startup":
                    startup_count += 1
                else:
                    mnc_count += 1
                    
                # Validate success rate
                if not isinstance(study["success_rate"], (int, float)) or study["success_rate"] < 90 or study["success_rate"] > 100:
                    self.log_test("Case Studies List API", False, f"Invalid success rate for {study['company_name']}: {study['success_rate']}%")
                    return None
                    
                # Extract revenue impact (assuming format like "$18.7M ARR" or "$142M ARR")
                revenue_str = study["revenue_impact"]
                try:
                    # Extract numeric value from revenue string
                    import re
                    revenue_match = re.search(r'\$(\d+(?:\.\d+)?)M', revenue_str)
                    if revenue_match:
                        revenue_value = float(revenue_match.group(1))
                        total_revenue_impact += revenue_value
                except:
                    pass
                    
            # Validate company type distribution
            if startup_count != 2:
                self.log_test("Case Studies List API", False, f"Expected 2 startups, got {startup_count}")
                return None
                
            if mnc_count != 1:
                self.log_test("Case Studies List API", False, f"Expected 1 MNC, got {mnc_count}")
                return None
                
            # Validate total revenue impact ($150M+ requirement)
            if total_revenue_impact < 150:
                self.log_test("Case Studies List API", False, f"Total revenue impact ${total_revenue_impact}M below required $150M+")
                return None
                
            self.log_test("Case Studies List API", True, f"All validations passed. Total revenue: ${total_revenue_impact}M", {"count": len(case_studies), "revenue": total_revenue_impact})
            return case_studies
            
        except requests.exceptions.RequestException as e:
            self.log_test("Case Studies List API", False, f"Request failed: {str(e)}")
            return None
        except json.JSONDecodeError as e:
            self.log_test("Case Studies List API", False, f"Invalid JSON response: {str(e)}")
            return None
        except Exception as e:
            self.log_test("Case Studies List API", False, f"Unexpected error: {str(e)}")
            return None
    
    def test_case_study_detail(self, case_studies: List[Dict]):
        """Test GET /api/case-studies/{case_id} endpoint"""
        if not case_studies:
            self.log_test("Case Study Detail API", False, "No case studies available for testing")
            return
            
        # Test with valid case study IDs
        for study in case_studies:
            case_id = study["id"]
            try:
                response = requests.get(f"{API_BASE}/case-studies/{case_id}", timeout=10)
                
                if response.status_code != 200:
                    self.log_test(f"Case Study Detail API ({case_id})", False, f"HTTP {response.status_code}: {response.text}")
                    continue
                    
                data = response.json()
                
                # Validate detailed fields are present
                detailed_fields = ["market_research", "competitive_analysis", "pricing_strategy", "channel_strategy", "execution_timeline"]
                missing_fields = [field for field in detailed_fields if field not in data]
                
                if missing_fields:
                    self.log_test(f"Case Study Detail API ({case_id})", False, f"Missing detailed fields: {missing_fields}")
                    continue
                    
                # Validate LTV:CAC ratio in key_metrics
                if "key_metrics" in data and isinstance(data["key_metrics"], dict):
                    ltv_cac = data["key_metrics"].get("ltv_cac_ratio")
                    if ltv_cac:
                        # Extract numeric value (format like "10.0x")
                        try:
                            ltv_cac_value = float(str(ltv_cac).replace("x", ""))
                            if ltv_cac_value < 9.8 or ltv_cac_value > 18.8:
                                self.log_test(f"Case Study Detail API ({case_id})", False, f"LTV:CAC ratio {ltv_cac} outside expected range 9.8x-18.8x")
                                continue
                        except:
                            pass
                            
                self.log_test(f"Case Study Detail API ({case_id})", True, f"Detailed data validated for {data.get('company_name', case_id)}")
                
            except requests.exceptions.RequestException as e:
                self.log_test(f"Case Study Detail API ({case_id})", False, f"Request failed: {str(e)}")
            except json.JSONDecodeError as e:
                self.log_test(f"Case Study Detail API ({case_id})", False, f"Invalid JSON response: {str(e)}")
            except Exception as e:
                self.log_test(f"Case Study Detail API ({case_id})", False, f"Unexpected error: {str(e)}")
        
        # Test with invalid case ID (should return 404)
        try:
            invalid_id = "invalid-case-id-12345"
            response = requests.get(f"{API_BASE}/case-studies/{invalid_id}", timeout=10)
            
            if response.status_code == 404:
                self.log_test("Case Study Detail API (404 Test)", True, "Correctly returns 404 for invalid case ID")
            else:
                self.log_test("Case Study Detail API (404 Test)", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Case Study Detail API (404 Test)", False, f"Error testing 404: {str(e)}")
    
    def test_frameworks(self):
        """Test GET /api/frameworks endpoint"""
        try:
            response = requests.get(f"{API_BASE}/frameworks", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Frameworks API", False, f"HTTP {response.status_code}: {response.text}")
                return
                
            data = response.json()
            
            if "frameworks" not in data:
                self.log_test("Frameworks API", False, "Missing 'frameworks' field in response")
                return
                
            frameworks = data["frameworks"]
            
            if not isinstance(frameworks, list):
                self.log_test("Frameworks API", False, "frameworks should be a list")
                return
                
            # Should have at least the High-Velocity GTM Framework
            if len(frameworks) == 0:
                self.log_test("Frameworks API", False, "No frameworks found")
                return
                
            # Validate framework structure
            required_fields = ["id", "name", "phases", "success_rate", "use_cases"]
            
            high_velocity_found = False
            for framework in frameworks:
                missing_fields = [field for field in required_fields if field not in framework]
                if missing_fields:
                    self.log_test("Frameworks API", False, f"Framework missing fields: {missing_fields}")
                    return
                    
                # Check for High-Velocity GTM Framework
                if "High-Velocity" in framework["name"]:
                    high_velocity_found = True
                    
                    # Validate success rate
                    success_rate = framework["success_rate"]
                    if not isinstance(success_rate, (int, float)) or success_rate < 90 or success_rate > 100:
                        self.log_test("Frameworks API", False, f"Framework success rate {success_rate}% not in range 90-100%")
                        return
                        
            if not high_velocity_found:
                self.log_test("Frameworks API", False, "High-Velocity GTM Framework not found")
                return
                
            self.log_test("Frameworks API", True, f"All validations passed. Found {len(frameworks)} framework(s)")
            
        except requests.exceptions.RequestException as e:
            self.log_test("Frameworks API", False, f"Request failed: {str(e)}")
        except json.JSONDecodeError as e:
            self.log_test("Frameworks API", False, f"Invalid JSON response: {str(e)}")
        except Exception as e:
            self.log_test("Frameworks API", False, f"Unexpected error: {str(e)}")
    
    def test_metrics(self, case_studies: List[Dict]):
        """Test GET /api/metrics/{case_id} endpoint"""
        if not case_studies:
            self.log_test("Metrics API", False, "No case studies available for testing")
            return
            
        for study in case_studies:
            case_id = study["id"]
            try:
                response = requests.get(f"{API_BASE}/metrics/{case_id}", timeout=10)
                
                if response.status_code != 200:
                    self.log_test(f"Metrics API ({case_id})", False, f"HTTP {response.status_code}: {response.text}")
                    continue
                    
                data = response.json()
                
                if "metrics" not in data:
                    self.log_test(f"Metrics API ({case_id})", False, "Missing 'metrics' field in response")
                    continue
                    
                metrics = data["metrics"]
                
                if not isinstance(metrics, list):
                    self.log_test(f"Metrics API ({case_id})", False, "metrics should be a list")
                    continue
                    
                # Validate metrics structure if any exist
                if len(metrics) > 0:
                    required_fields = ["id", "case_study_id", "metric_name", "metric_value", "category"]
                    
                    for metric in metrics:
                        missing_fields = [field for field in required_fields if field not in metric]
                        if missing_fields:
                            self.log_test(f"Metrics API ({case_id})", False, f"Metric missing fields: {missing_fields}")
                            continue
                            
                        # Validate case_study_id matches
                        if metric["case_study_id"] != case_id:
                            self.log_test(f"Metrics API ({case_id})", False, f"Metric case_study_id mismatch: {metric['case_study_id']} != {case_id}")
                            continue
                            
                self.log_test(f"Metrics API ({case_id})", True, f"Metrics data validated for {study.get('company_name', case_id)}")
                
            except requests.exceptions.RequestException as e:
                self.log_test(f"Metrics API ({case_id})", False, f"Request failed: {str(e)}")
            except json.JSONDecodeError as e:
                self.log_test(f"Metrics API ({case_id})", False, f"Invalid JSON response: {str(e)}")
            except Exception as e:
                self.log_test(f"Metrics API ({case_id})", False, f"Unexpected error: {str(e)}")
    
    def test_performance(self):
        """Test API response times"""
        endpoints = [
            "/api/dashboard-stats",
            "/api/case-studies",
            "/api/frameworks"
        ]
        
        for endpoint in endpoints:
            try:
                start_time = time.time()
                response = requests.get(f"{BASE_URL}{endpoint}", timeout=10)
                end_time = time.time()
                
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                if response.status_code == 200 and response_time < 5000:  # 5 second threshold
                    self.log_test(f"Performance Test {endpoint}", True, f"Response time: {response_time:.2f}ms")
                else:
                    self.log_test(f"Performance Test {endpoint}", False, f"Slow response: {response_time:.2f}ms or HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Performance Test {endpoint}", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run comprehensive backend API tests"""
        print("🚀 Starting GTM Strategy Portfolio Backend API Tests")
        print("=" * 60)
        
        # Test server health first
        if not self.test_server_health():
            print("❌ Server not accessible. Stopping tests.")
            return self.generate_report()
        
        # Test dashboard stats
        self.test_dashboard_stats()
        
        # Test case studies list and get data for other tests
        case_studies = self.test_case_studies_list()
        
        # Test case study details
        self.test_case_study_detail(case_studies)
        
        # Test frameworks
        self.test_frameworks()
        
        # Test metrics
        self.test_metrics(case_studies)
        
        # Test performance
        self.test_performance()
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 60)
        print("📊 GTM BACKEND API TEST REPORT")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_count = len(self.passed_tests)
        failed_count = len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_count}")
        print(f"❌ Failed: {failed_count}")
        print(f"Success Rate: {(passed_count/total_tests*100):.1f}%" if total_tests > 0 else "No tests run")
        
        if self.failed_tests:
            print("\n🔍 FAILED TESTS:")
            for test_name in self.failed_tests:
                test_result = next(t for t in self.test_results if t["test"] == test_name)
                print(f"  ❌ {test_name}: {test_result['message']}")
        
        if self.passed_tests:
            print(f"\n✅ PASSED TESTS ({len(self.passed_tests)}):")
            for test_name in self.passed_tests:
                print(f"  ✅ {test_name}")
        
        print("\n" + "=" * 60)
        
        return {
            "total_tests": total_tests,
            "passed": passed_count,
            "failed": failed_count,
            "success_rate": (passed_count/total_tests*100) if total_tests > 0 else 0,
            "failed_tests": self.failed_tests,
            "passed_tests": self.passed_tests,
            "details": self.test_results
        }

if __name__ == "__main__":
    tester = GTMBackendTester()
    report = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if report["failed"] > 0:
        sys.exit(1)
    else:
        print("🎉 All tests passed!")
        sys.exit(0)