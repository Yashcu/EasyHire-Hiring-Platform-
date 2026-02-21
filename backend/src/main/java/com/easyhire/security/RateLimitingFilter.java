package com.easyhire.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter implements Filter {

    private final Map<String, Integer> requestCounts = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS = 100;

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String ip = httpRequest.getRemoteAddr();

        requestCounts.put(ip, requestCounts.getOrDefault(ip, 0) + 1);

        if (requestCounts.get(ip) > MAX_REQUESTS) {
            ((HttpServletResponse) response)
                    .sendError(HttpServletResponse.SC_TOO_MANY_REQUESTS,
                            "Too many requests");
            return;
        }

        chain.doFilter(request, response);
    }
}