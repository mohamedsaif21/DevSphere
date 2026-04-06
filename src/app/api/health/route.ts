import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint to diagnose connectivity issues
 * Checks if Judge0 is accessible and what status it returns
 */
export async function GET(req: NextRequest) {
  const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';
  
  try {
    // Test basic connectivity with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(`${JUDGE0_URL}/about`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        status: 'healthy',
        judge0: 'connected',
        judge0_url: JUDGE0_URL,
        api_version: data.version || 'unknown',
      });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        judge0: 'not_responding',
        judge0_url: JUDGE0_URL,
        error: `Judge0 returned status ${res.status}`,
      }, { status: 503 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({
      status: 'unhealthy',
      judge0: 'unreachable',
      judge0_url: JUDGE0_URL,
      error: `Cannot connect to Judge0: ${message}`,
      hint: 'Judge0 may still be starting up. Wait 10-15 seconds and try again.',
    }, { status: 503 });
  }
}
