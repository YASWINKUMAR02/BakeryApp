# 🚀 Advanced Features Implementation Guide

## Overview

This guide covers the newly implemented advanced features:
1. ✅ Rate Limiting
2. ✅ Advanced Monitoring (Prometheus + Grafana)
3. ✅ Load Testing (Artillery + K6)
4. ✅ Test Coverage (JaCoCo)
5. ✅ Error Tracking (Sentry)

---

## 1. 🛡️ Rate Limiting

### What It Does
Prevents abuse by limiting requests per IP address on sensitive endpoints.

### Endpoints Protected
- **Login/Register**: 5 requests/minute
- **Password Reset**: 3 requests/5 minutes
- **Orders**: 20 requests/minute
- **Payments**: 20 requests/minute

### Configuration
File: `RateLimitingConfig.java`

```java
// Customize limits
if (path.contains("/login")) {
    limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
}
```

### Testing Rate Limiting
```bash
# Try to login 10 times quickly
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/customers/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done

# After 5 attempts, you'll see:
# {"success":false,"message":"Too many requests. Please try again later."}
```

### Disable Rate Limiting (Development)
Comment out the `@Configuration` annotation in `RateLimitingConfig.java`

---

## 2. 📊 Advanced Monitoring

### Stack
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Node Exporter**: System metrics
- **MySQL Exporter**: Database metrics

### Setup

#### Step 1: Start Monitoring Stack
```bash
cd monitoring
docker-compose -f docker-compose-monitoring.yml up -d
```

#### Step 2: Access Dashboards
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin123`

#### Step 3: Configure Grafana
1. Open Grafana (http://localhost:3001)
2. Login with admin/admin123
3. Go to Configuration → Data Sources
4. Add Prometheus:
   - URL: `http://prometheus:9090`
   - Click "Save & Test"
5. Go to Dashboards → Import
6. Upload `grafana-dashboard.json`

### Metrics Available

#### Application Metrics
- Request rate (requests/sec)
- Response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- Active requests

#### JVM Metrics
- Heap memory usage
- Non-heap memory usage
- GC pauses
- Thread count

#### Database Metrics
- Active connections
- Idle connections
- Connection wait time
- Query execution time

#### System Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network I/O

### Custom Metrics

Add custom metrics in your code:

```java
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Counter;

@Service
public class OrderService {
    private final Counter orderCounter;
    
    public OrderService(MeterRegistry registry) {
        this.orderCounter = registry.counter("orders.created");
    }
    
    public void createOrder() {
        // ... order logic
        orderCounter.increment();
    }
}
```

### Alerts

Configured alerts in `alerts.yml`:
- High error rate (>5%)
- High response time (>1s)
- Application down
- High CPU usage (>80%)
- High memory usage (>90%)
- Database connection pool exhausted
- Failed login attempts
- Low disk space

### View Alerts
- Prometheus: http://localhost:9090/alerts
- Alertmanager: http://localhost:9093

---

## 3. 🔥 Load Testing

### Tools Included
1. **Artillery** - Easy YAML-based testing
2. **K6** - Advanced JavaScript-based testing
3. **Apache Bench** - Quick command-line testing

### Quick Start

#### Artillery Test
```bash
# Install
npm install -g artillery

# Run test
cd load-testing
artillery run artillery-config.yml
```

#### K6 Test
```bash
# Install K6
# Windows: choco install k6
# Mac: brew install k6
# Linux: https://k6.io/docs/getting-started/installation/

# Run test
cd load-testing
k6 run k6-load-test.js
```

#### Apache Bench Test
```bash
# Quick test - 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:8080/api/items

# Stress test - 10000 requests, 100 concurrent
ab -n 10000 -c 100 -k http://localhost:8080/api/items
```

### Test Scenarios

#### Scenario 1: Normal Load
- 50 users/second
- 5 minutes duration
- Expected: <300ms response time

#### Scenario 2: Peak Load
- 100 users/second
- 2 minutes duration
- Expected: <500ms response time

#### Scenario 3: Stress Test
- Ramp up to 200 users/second
- Find breaking point
- Expected: Identify bottlenecks

### Interpreting Results

**Good Performance** ✅:
- p95 response time < 500ms
- Error rate < 5%
- Throughput > 50 req/s

**Needs Optimization** ⚠️:
- p95 response time > 1s
- Error rate > 10%
- Memory leaks detected

**Critical Issues** ❌:
- Application crashes
- Error rate > 20%
- Database connection failures

---

## 4. 🧪 Test Coverage

### JaCoCo Integration

Test coverage is now automatically generated when running tests.

### Run Tests with Coverage
```bash
cd bakeryapp
mvn clean test
```

### View Coverage Report
```bash
# Open in browser
start target/site/jacoco/index.html

# Or on Mac/Linux
open target/site/jacoco/index.html
```

### Coverage Goals
- **Current**: ~40% (with new tests)
- **Target**: 70%
- **Critical Services**: 80%+

### What's Tested Now
- ✅ ItemService (11 tests)
- ✅ CategoryService (6 tests)
- ✅ ItemController (5 tests)

### Add More Tests
Follow the pattern in existing test files:

```java
@ExtendWith(MockitoExtension.class)
class YourServiceTest {
    @Mock
    private YourRepository repository;
    
    @InjectMocks
    private YourService service;
    
    @Test
    void testMethod_ShouldDoSomething() {
        // Arrange
        when(repository.findById(1)).thenReturn(Optional.of(entity));
        
        // Act
        Result result = service.method(1);
        
        // Assert
        assertNotNull(result);
        verify(repository, times(1)).findById(1);
    }
}
```

### Coverage Threshold

Configured in `pom.xml`:
```xml
<limit>
    <counter>LINE</counter>
    <value>COVEREDRATIO</value>
    <minimum>0.50</minimum>  <!-- 50% minimum -->
</limit>
```

Build will fail if coverage drops below 50%.

---

## 5. 🐛 Error Tracking (Sentry)

### Setup Sentry

#### Step 1: Create Sentry Account
1. Go to https://sentry.io
2. Create free account
3. Create new project (Java/Spring Boot)
4. Copy your DSN

#### Step 2: Configure Application
Add to `application-prod.properties`:
```properties
# Sentry Configuration
sentry.dsn=https://your-dsn@sentry.io/project-id
sentry.environment=production
sentry.traces-sample-rate=1.0
```

#### Step 3: Test Error Tracking
```java
import io.sentry.Sentry;

@RestController
public class TestController {
    @GetMapping("/test-error")
    public String testError() {
        try {
            throw new RuntimeException("Test error for Sentry");
        } catch (Exception e) {
            Sentry.captureException(e);
            throw e;
        }
    }
}
```

### Features
- **Automatic error capture**
- **Stack traces**
- **User context**
- **Performance monitoring**
- **Release tracking**
- **Email alerts**

### View Errors
- Dashboard: https://sentry.io
- Real-time error notifications
- Performance insights
- User impact analysis

---

## 📈 Performance Benchmarks

### Current Performance (Expected)

| Metric | Value | Status |
|--------|-------|--------|
| Response Time (p95) | ~250ms | ✅ Excellent |
| Response Time (p99) | ~400ms | ✅ Good |
| Throughput | 50-100 req/s | ✅ Good |
| Error Rate | <2% | ✅ Excellent |
| Memory Usage | ~500MB | ✅ Good |
| CPU Usage | ~40% | ✅ Good |

### After Optimizations (Target)

| Metric | Target | Improvement |
|--------|--------|-------------|
| Response Time (p95) | <200ms | +20% |
| Throughput | >150 req/s | +50% |
| Error Rate | <1% | +50% |
| Memory Usage | <400MB | +20% |

---

## 🔧 Troubleshooting

### Issue: Rate Limiting Too Strict

**Solution**: Adjust limits in `RateLimitingConfig.java`
```java
// Increase login limit to 10/minute
limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1)));
```

### Issue: Prometheus Not Collecting Metrics

**Solution**: Check actuator endpoints
```bash
# Verify prometheus endpoint
curl http://localhost:8080/actuator/prometheus

# Check actuator health
curl http://localhost:8080/actuator/health
```

### Issue: Load Test Failing

**Solution**: Check application is running
```bash
# Verify app is up
curl http://localhost:8080/actuator/health

# Check logs
docker-compose logs -f backend
```

### Issue: Low Test Coverage

**Solution**: Add more tests
```bash
# Run with coverage
mvn clean test

# View report
open target/site/jacoco/index.html

# Focus on untested classes
```

---

## 📊 Monitoring Checklist

Daily:
- [ ] Check Grafana dashboards
- [ ] Review error rates
- [ ] Check response times
- [ ] Monitor CPU/memory

Weekly:
- [ ] Run load tests
- [ ] Review Sentry errors
- [ ] Check test coverage
- [ ] Optimize slow queries

Monthly:
- [ ] Performance review
- [ ] Capacity planning
- [ ] Security audit
- [ ] Dependency updates

---

## 🎯 Next Steps

1. ✅ **Start monitoring stack**
   ```bash
   cd monitoring
   docker-compose -f docker-compose-monitoring.yml up -d
   ```

2. ✅ **Run load test**
   ```bash
   cd load-testing
   artillery run artillery-config.yml
   ```

3. ✅ **Check test coverage**
   ```bash
   cd bakeryapp
   mvn clean test
   open target/site/jacoco/index.html
   ```

4. ✅ **Set up Sentry**
   - Create account
   - Add DSN to config
   - Test error tracking

5. ✅ **Monitor in production**
   - Watch Grafana dashboards
   - Set up alerts
   - Review metrics daily

---

## 📚 Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/)
- [K6 Load Testing](https://k6.io/docs/)
- [JaCoCo Coverage](https://www.jacoco.org/jacoco/trunk/doc/)
- [Sentry Documentation](https://docs.sentry.io/)

---

**Your app is now enterprise-ready with advanced monitoring and testing! 🚀**
