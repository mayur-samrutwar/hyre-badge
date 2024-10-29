import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider } = req.body;
    console.log('Initializing verification for provider:', provider);
    
    const providerIds = {
      'Total Repositories': process.env.RECLAIM_GITHUB_TOTAL_REPOS_PROVIDER_ID,
      'Total Stars': process.env.RECLAIM_GITHUB_TOTAL_CONTRIBUTIONS_PROVIDER_ID,
      'Total Questions Solved': process.env.RECLAIM_LEETCODE_TOTAL_SOLVED_PROVIDER_ID,
      'Rating': process.env.RECLAIM_CODEFORCES_RATING_PROVIDER_ID,
    };

    const providerId = providerIds[provider];
    if (!providerId) {
      console.error('Invalid provider:', provider);
      return res.status(400).json({ error: 'Invalid provider' });
    }

    console.log('Using provider ID:', providerId);
    const reclaimProofRequest = await ReclaimProofRequest.init(
      process.env.RECLAIM_APP_ID,
      process.env.RECLAIM_APP_SECRET,
      providerId
    );

    const requestUrl = await reclaimProofRequest.getRequestUrl();
    const statusUrl = reclaimProofRequest.getStatusUrl();
    console.log('Generated URLs:', { requestUrl, statusUrl });

    // Start the session
    reclaimProofRequest.startSession({
      onSuccessCallback: (proofs) => {
        console.log('Verification success callback:', proofs);
      },
      onFailureCallback: (error) => {
        console.error('Verification failure callback:', error);
      }
    });

    res.status(200).json({ requestUrl, statusUrl });
  } catch (error) {
    console.error('Error in get-verification-url:', error);
    res.status(500).json({ error: 'Failed to generate verification URL' });
  }
}
