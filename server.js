const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = '5c6b7b2f-47e2-4811-b577-6e5653f49815';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

app.post('/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        
        const response = await axios.post(API_URL, {
            model: 'deepseek-v3-241226',
            messages: [
                {
                    role: 'system',
                    content: '使用一个金句总结全文最核心的内容'
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.6,
            stream: true
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            timeout: 60000
        });

        res.json({ summary: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '生成总结时出错' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});