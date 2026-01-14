export default function handler(req, res) {
    if (req.method === 'POST') {
        const { video, portada_link } = req.body;

        console.log("Webhook Received:", req.body);

        // TODO: Here we should:
        // 1. Save this to a database (Supabase/Firebase/Redis)
        // 2. OR Trigger a WebSocket event (Pusher/Ably)

        // For now, we just acknowledge receipt
        return res.status(200).json({ received: true });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
