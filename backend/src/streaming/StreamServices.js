import StreamCore from './StreamCore.js';

// Mock Implementations for services that don't exist yet
const MockTransaction = {
    watch: () => ({
        on: (event, callback) => {
            if (event === 'change') {
                // Simulate a new transaction every 15 seconds for a specific user
                setInterval(() => {
                    const change = {
                        fullDocument: {
                            user: 'user123', // Hardcoded for demonstration
                            description: `Test Transaction ${new Date().toLocaleTimeString()}`,
                            amount: (Math.random() * 100).toFixed(2),
                            createdAt: new Date()
                        }
                    };
                    callback(change);
                }, 15000);
            }
        }
    })
};

const MockExchangeService = {
    getRate: async (currency) => {
        // Simulate fetching an exchange rate
        return Promise.resolve((Math.random() * 1.5).toFixed(4));
    }
};

const MockSophiaService = {
    getLiveInsights: async (userId) => {
        // Simulate fetching AI insights
        return Promise.resolve(`AI insight for ${userId}: Consider diversifying your portfolio. ${new Date().toLocaleTimeString()}`);
    }
};


class StreamServices {
  static streamTransactions(userId) {
    const stream = StreamCore.getOrCreateStream(userId, 'transactions');

    // Using MockTransaction for now
    MockTransaction.watch().on('change', (change) => {
      // In a real scenario, we'd check if the change belongs to the specific userId
      // For this mock, we broadcast to any user subscribed to this stream type.
      if (change.fullDocument.user === userId) {
          StreamCore.broadcast(stream.id, {
            type: 'TRANSACTION_UPDATE',
            data: change.fullDocument
          });
      }
    });

    return stream;
  }

  static streamMarketData(userId, currencies = ['USD/EUR']) {
    const stream = StreamCore.getOrCreateStream(userId, 'market_data');

    currencies.forEach(currency => {
      setInterval(async () => {
        const rate = await MockExchangeService.getRate(currency);
        StreamCore.broadcast(stream.id, {
          type: 'MARKET_UPDATE',
          currency,
          rate
        });
      }, 5000);
    });

    return stream;
  }

  static streamAIInsights(userId) {
    const stream = StreamCore.getOrCreateStream(userId, 'ai_insights');

    setInterval(async () => {
      const insights = await MockSophiaService.getLiveInsights(userId);
      StreamCore.broadcast(stream.id, {
        type: 'AI_INSIGHT',
        insights
      });
    }, 10000);

    return stream;
  }
}

export default StreamServices;