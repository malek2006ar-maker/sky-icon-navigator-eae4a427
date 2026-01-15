import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PublishRequest {
  platform?: string;
  content_type?: string;
  content_id?: string;
  title?: string;
  description?: string;
  image_url?: string;
  test?: boolean;
  message?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: PublishRequest = await req.json();
    const { platform, content_type, content_id, title, description, image_url, test, message } = body;

    // Get automation settings for the platform
    const { data: settings } = await supabase
      .from('automation_settings')
      .select('*')
      .eq('platform', platform)
      .eq('is_enabled', true)
      .single();

    if (!settings) {
      return new Response(
        JSON.stringify({ error: 'المنصة غير مفعلة أو غير موجودة' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = settings.config as Record<string, string>;
    let result: any = null;

    // Handle different platforms
    switch (platform) {
      case 'telegram':
        result = await publishToTelegram(config, test ? message! : formatMessage(title, description), image_url, test);
        break;
      case 'facebook':
        result = await publishToFacebook(config, test ? message! : formatMessage(title, description), image_url, test);
        break;
      case 'twitter':
        result = await publishToTwitter(config, test ? message! : formatMessage(title, description), test);
        break;
      case 'whatsapp':
        result = await publishToWhatsApp(config, test ? message! : formatMessage(title, description), test);
        break;
      case 'instagram':
        result = await publishToInstagram(config, test ? message! : formatMessage(title, description), image_url, test);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'منصة غير مدعومة' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Log the result (skip for test messages)
    if (!test && content_id) {
      await supabase.from('automation_logs').insert({
        platform,
        content_type: content_type || 'test',
        content_id,
        status: result.success ? 'success' : 'failed',
        response: result.data,
        error_message: result.error
      });
    }

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, data: result.data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function formatMessage(title?: string, description?: string): string {
  let msg = '';
  if (title) msg += `✈️ *${title}*\n\n`;
  if (description) msg += description;
  msg += '\n\n🌐 Sky Icon Travel';
  return msg;
}

async function publishToTelegram(
  config: Record<string, string>, 
  message: string, 
  imageUrl?: string,
  isTest?: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { bot_token, chat_id } = config;
  
  if (!bot_token || !chat_id) {
    return { success: false, error: 'Bot Token و Chat ID مطلوبان' };
  }

  try {
    let response;
    
    if (imageUrl && !isTest) {
      // Send photo with caption
      response = await fetch(`https://api.telegram.org/bot${bot_token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          photo: imageUrl,
          caption: message,
          parse_mode: 'Markdown'
        })
      });
    } else {
      // Send text message
      response = await fetch(`https://api.telegram.org/bot${bot_token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    const data = await response.json();
    
    if (data.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.description || 'فشل في الإرسال' };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

async function publishToFacebook(
  config: Record<string, string>,
  message: string,
  imageUrl?: string,
  isTest?: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { page_id, access_token } = config;
  
  if (!page_id || !access_token) {
    return { success: false, error: 'Page ID و Access Token مطلوبان' };
  }

  try {
    let url = `https://graph.facebook.com/${page_id}/feed`;
    const body: any = {
      message: message.replace(/\*/g, ''),
      access_token
    };

    if (imageUrl && !isTest) {
      url = `https://graph.facebook.com/${page_id}/photos`;
      body.url = imageUrl;
      body.caption = message.replace(/\*/g, '');
      delete body.message;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (data.id || data.post_id) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error?.message || 'فشل في النشر' };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

async function publishToTwitter(
  config: Record<string, string>,
  message: string,
  isTest?: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { api_key, api_secret, access_token, access_secret } = config;
  
  if (!api_key || !api_secret || !access_token || !access_secret) {
    return { success: false, error: 'جميع مفاتيح API مطلوبة' };
  }

  // Twitter API v2 requires OAuth 1.0a which is complex to implement
  // For now, return a placeholder
  return { 
    success: false, 
    error: 'تكامل تويتر يتطلب إعداد OAuth معقد. يُنصح باستخدام Zapier أو Make للتكامل مع تويتر.' 
  };
}

async function publishToWhatsApp(
  config: Record<string, string>,
  message: string,
  isTest?: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { phone_number_id, access_token } = config;
  
  if (!phone_number_id || !access_token) {
    return { success: false, error: 'Phone Number ID و Access Token مطلوبان' };
  }

  // WhatsApp Business API requires approved templates for business-initiated messages
  return { 
    success: false, 
    error: 'واتساب بيزنس يتطلب قوالب رسائل معتمدة من Meta. يُنصح بالتواصل مع Meta للحصول على الموافقة.' 
  };
}

async function publishToInstagram(
  config: Record<string, string>,
  message: string,
  imageUrl?: string,
  isTest?: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { account_id, access_token } = config;
  
  if (!account_id || !access_token) {
    return { success: false, error: 'Account ID و Access Token مطلوبان' };
  }

  if (!imageUrl && !isTest) {
    return { success: false, error: 'انستغرام يتطلب صورة للنشر' };
  }

  try {
    // Step 1: Create media container
    const createResponse = await fetch(
      `https://graph.facebook.com/v18.0/${account_id}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: message.replace(/\*/g, ''),
          access_token
        })
      }
    );

    const createData = await createResponse.json();
    
    if (!createData.id) {
      return { success: false, error: createData.error?.message || 'فشل في إنشاء المنشور' };
    }

    // Step 2: Publish the media
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${account_id}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: createData.id,
          access_token
        })
      }
    );

    const publishData = await publishResponse.json();
    
    if (publishData.id) {
      return { success: true, data: publishData };
    } else {
      return { success: false, error: publishData.error?.message || 'فشل في النشر' };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
