const GENERAL_PROMPT = `
Below Given is the description of a website that I want to build.
I want to build this website in complete Next.js app router with complete TypeScript.
UI/UX should be very beautiful and attractive.
The website should be responsive and should work on all devices.
The website should contain as many features as possible.
Also, write complete backend code for the website as it is written in Next.js.
Treat this website as a complete full-stack project.
`;

export const STEP_GENERATION_PROMPT = (prompt: string) => `
${GENERAL_PROMPT}

Now, To accomplish all the above requirements,
I want you to generate set of detailed steps, following which a complete website as described can be built.

I wish to build website, as described below:
${prompt}

Give response with detailed steps to build the website.
`

export const CODE_GENERATION_PROMPT = (prompt: string, steps: string) => `
${GENERAL_PROMPT}

Now, To accomplish all the above requirements,
I want you to generate code for the website as described below:
${prompt}

Following are the detailed steps to build the website:
${steps}

You should follow following folder structure:
- prisma
  - schema.prisma
- public (if required)
- src
  - app
    - api
      (folders and files of all the api routes should be inside this api folder)
    - global.css
    - layout.tsx
    - page.tsx
  - components
    (folders and files of all the components should be inside this components folder)
  (all other folders and files should be inside this src folder)
- .env
- eslint.config.json
- next-env.d.ts
- next.config.ts
- package.json
- postcss.config.mjs
- tailwind.config.ts
- tsconfig.json

Strictly follow the above folder structure.
Including all the required files and folders.
Do not include any extra files or folders.
Or dont mis-place any file or folder.
each file and folder should be placed at its correct location.
IMP: Do not include any folder other than api, or any pages of the website, inside the app directory,
IMP: All these extra folders should be included in src directory directly, do not add them in /src/app directory.

File should be well formatted and should be written in TypeScript.
Avoid any extra tabs in code.
As a file content there should on be the code nonthing else.
`

export const CODE_MODIFICATION_PROMPT = (prompt: string, code: string) => `
${GENERAL_PROMPT}

Below is the code of website that I built:
${code}

Only respond with the files that you want to modify or add.
Do not remove any file.

Now, To accomplish all the above requirements,
I want you to modify the code for the website as described below:
${prompt}
`