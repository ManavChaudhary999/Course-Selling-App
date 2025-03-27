# Step 1: Use a lightweight Node.js base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json, package-lock.json and Prisma Files
COPY package.json package-lock.json ./
COPY ./prisma .

# Step 4: Install dependencies and generate Prisma Client
RUN npm install
RUN npx prisma generate

# Step 5: Copy the entire application code
COPY . .

# Step 6: Build the app
RUN npm run build

# Step 7: Expose the app's port
EXPOSE 8787

# Step 8: Define the startup command
CMD ["npm", "start"]