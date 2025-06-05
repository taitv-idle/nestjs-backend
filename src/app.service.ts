import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <html>
        <head>
          <title>Server Information</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f0f2f5;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #1a73e8;
              margin-bottom: 1rem;
            }
            p {
              color: #5f6368;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Our Server</h1>
            <p>This is a NestJS backend server running successfully.</p>
            <p>Server is up and ready to handle requests!</p>
          </div>
        </body>
      </html>
    `;
  }
}
