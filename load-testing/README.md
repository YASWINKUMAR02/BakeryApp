# 🚀 Load Testing Guide

## Overview

This directory contains load testing configurations for the Bakery App using multiple tools.

---

## Tools Available

### 1. **Artillery** (Recommended for beginners)
- Easy to use
- YAML configuration
- Good reporting

### 2. **K6** (Recommended for advanced users)
- JavaScript-based
- Better performance
- Grafana integration

### 3. **Apache Bench** (Quick tests)
- Command-line tool
- Simple and fast
- Limited features

---

## Installation

### Artillery
```bash
npm install -g artillery
```

### K6
```bash
# Windows (using Chocolatey)
choco install k6

# Or download from: https://k6.io/docs/getting-started/installation/
```

### Apache Bench
```bash
# Usually pre-installed on Linux/Mac
# Windows: Download Apache and use ab.exe
```

---

## Running Load Tests

### Before Testing
1. Start your application:
   ```bash
   cd bakeryapp
   mvn spring-boot:run
   ```

2. Verify it's running:
   ```bash
   curl http://localhost:8080/actuator/health
   ```

---

### Test 1: Artillery Load Test

```bash
cd load-testing
artillery run artillery-config.yml
```

**What it tests**:
- Browse products (40% of traffic)
- View product details (30%)
- Search products (20%)
- Health checks (10%)

**Test phases**:
1. Warm-up: 5 users/sec for 1 minute
2. Ramp-up: 5 to 50 users/sec over 2 minutes
3. Sustained: 50 users/sec for 5 minutes
4. Spike: 100 users/sec for 1 minute

**Expected output**:
```
Summary report @ 13:45:23
  Scenarios launched:  15000
  Scenarios completed: 15000
  Requests completed:  45000
  Mean response/sec:   50.5
  Response time (msec):
    min: 12
    max: 450
    median: 85
    p95: 250
    p99: 380
```

---

### Test 2: K6 Load Test

```bash
cd load-testing
k6 run k6-load-test.js
```

**What it tests**:
- All items endpoint
- Categories endpoint
- Featured items
- Individual item details
- Health checks

**Test stages**:
1. Ramp to 10 users (1 min)
2. Ramp to 50 users (3 min)
3. Stay at 50 users (5 min)
4. Spike to 100 users (2 min)
5. Ramp down (2 min)

**Expected output**:
```
     ✓ items list status is 200
     ✓ categories status is 200
     ✓ health check is UP

     checks.........................: 95.00% ✓ 28500 ✗ 1500
     data_received..................: 45 MB  350 kB/s
     data_sent......................: 2.8 MB 22 kB/s
     http_req_duration..............: avg=85ms   min=12ms med=75ms max=450ms p(95)=250ms
     http_req_failed................: 2.00%  ✓ 900   ✗ 44100
```

---

### Test 3: Apache Bench (Quick Test)

```bash
# Test items endpoint
ab -n 1000 -c 10 http://localhost:8080/api/items

# Test with keep-alive
ab -n 5000 -c 50 -k http://localhost:8080/api/items

# Test health endpoint
ab -n 10000 -c 100 http://localhost:8080/actuator/health
```

**Parameters**:
- `-n`: Number of requests
- `-c`: Concurrent requests
- `-k`: Keep-alive

**Expected output**:
```
Requests per second:    250.50 [#/sec] (mean)
Time per request:       39.920 [ms] (mean)
Time per request:       3.992 [ms] (mean, across all concurrent requests)
Transfer rate:          125.30 [Kbytes/sec] received

Percentage of the requests served within a certain time (ms)
  50%     35
  66%     42
  75%     48
  80%     52
  90%     65
  95%     85
  98%    120
  99%    180
 100%    450 (longest request)
```

---

## Performance Benchmarks

### Target Performance

| Metric | Target | Good | Excellent |
|--------|--------|------|-----------|
| **Response Time (p95)** | <500ms | <300ms | <200ms |
| **Response Time (p99)** | <1000ms | <500ms | <300ms |
| **Throughput** | >50 req/s | >100 req/s | >200 req/s |
| **Error Rate** | <5% | <2% | <1% |
| **CPU Usage** | <80% | <60% | <40% |
| **Memory Usage** | <2GB | <1.5GB | <1GB |

### Current Performance (Expected)

Based on your setup:
- **Response Time (p95)**: ~250ms ✅
- **Throughput**: ~50-100 req/s ✅
- **Error Rate**: <2% ✅

---

## Interpreting Results

### Good Signs ✅
- Response times under 500ms for 95% of requests
- Error rate below 5%
- Throughput matches expected load
- No memory leaks (stable memory usage)
- CPU usage below 80%

### Warning Signs ⚠️
- Response times increasing over time
- Error rate above 5%
- Memory usage growing continuously
- CPU at 100% for extended periods
- Database connection pool exhausted

### Critical Issues ❌
- Application crashes
- Error rate above 20%
- Response times over 5 seconds
- Out of memory errors
- Database connection failures

---

## Troubleshooting

### Issue: High Response Times

**Causes**:
- Database queries not optimized
- Missing indexes
- Too many database connections

**Solutions**:
```bash
# Run database optimization
mysql -u root -p bakery_db < database/optimization_indexes.sql

# Increase connection pool
# In application.properties:
spring.datasource.hikari.maximum-pool-size=20
```

### Issue: High Error Rate

**Causes**:
- Rate limiting triggered
- Database connection pool exhausted
- Memory issues

**Solutions**:
```bash
# Check logs
docker-compose logs -f backend

# Increase rate limits
# Edit RateLimitingConfig.java

# Increase memory
# In docker-compose.yml:
JAVA_OPTS: "-Xmx2g -Xms1g"
```

### Issue: Application Crashes

**Causes**:
- Out of memory
- Too many threads
- Database connection leaks

**Solutions**:
```bash
# Monitor resources
docker stats

# Check memory usage
curl http://localhost:8080/actuator/metrics/jvm.memory.used

# Restart with more memory
docker-compose down
docker-compose up -d
```

---

## Continuous Load Testing

### GitHub Actions Integration

Create `.github/workflows/load-test.yml`:

```yaml
name: Load Test
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start application
        run: docker-compose up -d
      - name: Wait for app
        run: sleep 30
      - name: Run K6 test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: load-testing/k6-load-test.js
      - name: Stop application
        run: docker-compose down
```

---

## Best Practices

1. **Start Small**: Begin with low load and gradually increase
2. **Monitor**: Watch CPU, memory, and database during tests
3. **Baseline**: Establish baseline performance before optimizing
4. **Iterate**: Test → Analyze → Optimize → Repeat
5. **Production-like**: Test in environment similar to production
6. **Regular Testing**: Run load tests regularly (weekly/monthly)

---

## Next Steps

1. ✅ Run basic load test with Artillery
2. ✅ Analyze results
3. ✅ Optimize based on findings
4. ✅ Run advanced test with K6
5. ✅ Set up continuous load testing
6. ✅ Monitor in production

---

## Resources

- [Artillery Documentation](https://www.artillery.io/docs)
- [K6 Documentation](https://k6.io/docs/)
- [Apache Bench Guide](https://httpd.apache.org/docs/2.4/programs/ab.html)
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/performance-testing/)

---

**Happy Load Testing! 🚀**
