"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { APIService } from "@/services/api";
import { useAPIProvider, useAPI } from "@/hooks/useAPI";
import { User } from "@/types";

export const APITestPanel = () => {
  const { provider, isUsingLocalStorage, switchProvider, availableProviders } = useAPIProvider();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test user creation
  const { execute: createTestUser, loading: creatingUser } = useAPI(
    APIService.createUser.bind(APIService),
    {
      onSuccess: (user) => {
        setCurrentUser(user);
        addTestResult(`✅ User created successfully: ${user.username} (${user.email})`);
      },
      onError: (error) => {
        addTestResult(`❌ Failed to create user: ${error}`);
      },
      showToast: false
    }
  );

  // Test authentication
  const { execute: testAuth, loading: testingAuth } = useAPI(
    APIService.authenticate.bind(APIService),
    {
      onSuccess: (user) => {
        if (user) {
          setCurrentUser(user);
          addTestResult(`✅ Authentication successful for: ${user.email}`);
        } else {
          addTestResult(`❌ Authentication failed`);
        }
      },
      onError: (error) => {
        addTestResult(`❌ Authentication error: ${error}`);
      },
      showToast: false
    }
  );

  const handleTestCreateUser = async () => {
    const testEmail = `test_${Date.now()}@example.com`;
    await createTestUser({
      username: `testuser_${Date.now()}`,
      email: testEmail,
      password: "testpass123",
      tagline: "Test User",
      bio: "This is a test user",
      socialLinks: {
        twitter: "@testuser"
      }
    });
  };

  const handleTestAuth = async () => {
    await testAuth("demo@example.com", "password");
  };

  const handleTestSwitchProvider = async (newProvider: typeof availableProviders[number]) => {
    try {
      switchProvider(newProvider);
      addTestResult(`🔄 Switched to ${newProvider} provider`);
      
      // Test the new provider
      if (newProvider === 'supabase') {
        addTestResult("⚠️  Note: Supabase requires proper environment configuration");
      } else if (newProvider === 'custom') {
        addTestResult("⚠️  Note: Custom API requires proper environment configuration");
      } else {
        addTestResult(`✅ ${newProvider} provider is ready to use`);
      }
    } catch (error) {
      addTestResult(`❌ Failed to switch provider: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getProviderStatus = (prov: typeof availableProviders[number]) => {
    if (prov === provider) return ' (current)';
    if (prov === 'localStorage' || prov === 'mock') return ' ✅';
    return ' ⚠️';
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔧 API Provider Test Panel
          <span className="text-sm font-normal">
            Current: <span className="font-semibold">{provider}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Status */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Provider Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableProviders.map((prov) => (
              <Button
                key={prov}
                variant={provider === prov ? "primary" : "outline"}
                onClick={() => handleTestSwitchProvider(prov)}
                className="text-sm"
              >
                {prov}{getProviderStatus(prov)}
              </Button>
            ))}
          </div>
          <div className="mt-3 p-3 bg-muted rounded-md">
            <div className="text-sm space-y-1">
              <div><strong>Provider:</strong> {provider}</div>
              <div><strong>Using LocalStorage:</strong> {isUsingLocalStorage ? 'Yes' : 'No'}</div>
              <div><strong>Data Persistence:</strong> {isUsingLocalStorage ? 'Browser only' : 'External provider'}</div>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-3">API Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleTestCreateUser}
              disabled={creatingUser}
              variant="outline"
            >
              {creatingUser ? 'Creating...' : '🆕 Create Test User'}
            </Button>
            
            <Button
              onClick={handleTestAuth}
              disabled={testingAuth}
              variant="outline"
            >
              {testingAuth ? 'Testing...' : '🔐 Test Authentication'}
            </Button>
          </div>
        </div>

        {/* Current User */}
        {currentUser && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Current User</h3>
            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm space-y-1">
                <div><strong>ID:</strong> {currentUser.id}</div>
                <div><strong>Username:</strong> {currentUser.username}</div>
                <div><strong>Email:</strong> {currentUser.email}</div>
                <div><strong>Tagline:</strong> {currentUser.tagline}</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Test Results</h3>
          <div className="h-40 overflow-y-auto bg-muted rounded-md p-3">
            {testResults.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Run tests to see results here...
              </div>
            ) : (
              <div className="text-sm space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
          {testResults.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTestResults([])}
              className="mt-2"
            >
              Clear Results
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-semibold text-green-900 mb-2">Instructions</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>localStorage/mock:</strong> Works immediately, no setup required</li>
            <li>• <strong>Supabase:</strong> Requires Supabase account and environment setup</li>
            <li>• <strong>Custom API:</strong> Requires your own API server and environment setup</li>
            <li>• Switch providers and test to see how the abstraction layer works</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default APITestPanel;
