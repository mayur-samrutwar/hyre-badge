import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { providerId, providerEnvKey } = req.body;
    console.log('Initializing verification for provider:', providerId);
    
    const reclaimProviderId = process.env[providerEnvKey];
    if (!reclaimProviderId) {
      console.error('Provider ID not configured:', providerEnvKey);
      return res.status(500).json({ error: 'Provider not configured' });
    }

    console.log('Using provider ID:', reclaimProviderId);
    const reclaimProofRequest = await ReclaimProofRequest.init(
      process.env.NEXT_PUBLIC_RECLAIM_APP_ID,
      process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET,
      reclaimProviderId
    );

    const requestUrl = await reclaimProofRequest.getRequestUrl();
    const statusUrl = reclaimProofRequest.getStatusUrl();
    console.log('Generated URLs:', { requestUrl, statusUrl });

    res.status(200).json({ requestUrl, statusUrl });
  } catch (error) {
    console.error('Error in get-verification-url:', error);
    res.status(500).json({ error: 'Failed to generate verification URL' });
  }
}
