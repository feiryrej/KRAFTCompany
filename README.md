<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/feiryrej/KRAFTCompany">
    <img src="https://github.com/feiryrej/KRAFTCompany/assets/116869096/a89f2100-44c2-43c5-9aa2-536610666759" alt="Logo" width="80" height="80">
  </a>


  <h1 align="center">KRAFT</h1>
  <p align="center">
    Your Commuting Buddy
    <br />
    <a href="https://drive.google.com/file/d/1yS8kMfTHYsi9vOEHuishXdnfKdnZJrDf/view?usp=sharing"><strong>Explore the paper »</strong></a>
    <br />
    <br />
    <a href="#website-snapshots">View Snapshots</a>
    ·
    <a href="https://github.com/feiryrej/KRAFTCompany/issues">Report Bug</a>
    ·
    <a href="https://github.com/feiryrej/KRAFTCompany/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

K.R.A.F.T. Company is implementing a robust RDBMS to streamline its employment application process. Our goal is to efficiently manage applications, track candidate progress, and enhance communication between recruiters and applicants.

### Table Of Contents
<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#table-of-contents">Table Of Contents</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#technologies-used">Technologies Used</a></li>
    </ul>
  </li>
  <li>
    <a href="#database-design">Database Design</a>
  </li>
  <li>
    <a href="#website-snapshots">Website Snapshots</a>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </li>
  <li>
    <a href="#run">Run</a>
  </li>
  <li>
    <a href="#contributors">Contributors</a>
  </li>
  <li>
    <a href="#license">License</a>
  </li>
</ol> 

### Features
- Authentication System
- Log in and log out function
- Dashboard
- Queries
- Applicant CRUD
- Application CRUD
- Education History CRUD
- Employment History CRUD
- Reference CRUD
- Print Functionality
- Search

### Technologies Used

KRAFT uses a number of open source projects to work properly:

- **[React](https://react.dev/)** 
- **[Node.js](https://nodejs.org/en)** 
- **[Express](https://expressjs.com/)**
- **[MySQL](https://www.mysql.com/)**
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**

## Database Design
Database design plays a very important part in the Software Development Life Cycle (SDLC). This part includes creating metadata, normalization, and constructing an Entity-Relationship Diagram (ERD).

- [KRAFT Metadata](https://drive.google.com/file/d/1yS8kMfTHYsi9vOEHuishXdnfKdnZJrDf/view?usp=drive_link)

- [KRAFT Normalization](https://docs.google.com/spreadsheets/d/124bbZ7ouiWAvD4o5zNh6cpj74sUj69iw/edit?usp=sharing&ouid=112699599917769491070&rtpof=true&sd=true)

- [PKRAFT ERD](https://drive.google.com/file/d/1vuParCXUbfH7dsntEip-CoXTuUoDHQm3/view?usp=sharing)

To add, provided [here](https://drive.google.com/file/d/16KIyYrTSyngqj3-zBF4LNOG9iv-1n_Me/view?usp=sharing) is the `.sql` file of `dbKraft` (the database used) if you want to have the database ready.

## Website Snapshots

### Log in page
![Screenshot 2024-07-08 172407](https://github.com/feiryrej/KRAFTCompany/assets/116869096/c6ee892d-db3f-4bc8-9c6d-84ed0c8aefdf)

### Home page

![Screenshot 2024-07-08 172455](https://github.com/feiryrej/KRAFTCompany/assets/116869096/4fa4b274-e170-4246-9115-8e2019cadd33)

### CRUD page example
![Screenshot 2024-07-08 172629](https://github.com/feiryrej/KRAFTCompany/assets/116869096/859e3481-b02d-46e0-a29a-eb302d0899b3)


### Query page
![Screenshot 2024-07-08 175850](https://github.com/feiryrej/KRAFTCompany/assets/116869096/7aff541c-3971-40b5-993a-40de43ec20d3)


### Query page example
![Screenshot 2024-07-08 180056](https://github.com/feiryrej/KRAFTCompany/assets/116869096/415cf061-7fc0-4ce4-a4d1-5c7c9f9c07df)

## Getting Started
KRAFT is not yet accessible to the world wide web, as it is yet to be deployed. But, if you're interested in seeing the UI and experience the website yourself, you are in the right section of the README. To get started with accessing the source code, follow the steps below.

### Prequisites

- Ensure that Node.js and npm are installed on your machine.

### Installation

1. You can fork this repository, or you can also clone this repository directly on your local machine.

2. After cloning the repository on your local machine, access it on any IDE.

    > After opening the project, you should see all the files

3. Install dependencies using,

    ```bash
    npm install
    ```

3. Create a .env on the server folder and type the code below. Make sure to replace `YOUR_DB_PASSWORD_HERE` with your actual **MariaDB/MySQL/Any RDBMS password**.

    ```bash
    DATABASE_PASSWORD="YOUR_DB_PASSWORD_HERE"
    ```

3. Configure the database connection in `server/config/db.js` as per your MariaDB/MySQL/Any RDBMS database environment.

4. To install the required dependencies for the **client** folder, see the [`package.json`](https://github.com/feiryrej/KRAFTCompany/blob/main/client/package.json) for the client-side.

5. To install the required dependencies for the **server** folder, see the [`package.json`](https://github.com/github.com/feiryrej/KRAFTCompany/blob/main/server/package.json) for the server-side.

## Run

- Run the server on `/server`.

    ```bash
    node server.js
    ```

- With `nodemon`, you can run the server using,

    ```bash
    npm run server
    ```

- Run the client on `/client`.

    ```bash
    npm start
    ```

<!-- Contributor's Table -->
  <h3>Contributor's Table</h3>
  <table style="width: 100%; text-align: center;">
    <thead>
      <tr>
        <th>Name</th>
        <th>Avatar</th>
        <th>GitHub</th>
        <th>Contributions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Regina Bonifacio</td>
        <td><img src="https://avatars.githubusercontent.com/u/116869096?v=4" alt="" style="border-radius: 50%; width: 50px;"></td>
        <td><a href="https://github.com/feiryrej">Feiryrej</a></td>
        <td>Fullstack Developer</td>
      </tr>
      <tr>
        <td>Isaeus Guiang</td>
        <td><img src="https://avatars.githubusercontent.com/u/142424210?v=4" alt="" style="border-radius: 50%; width: 50px;"></td>
        <td><a href="https://github.com/asiguiang">asiguiang</a></td>
        <td>Database Administrator, Technical Writer</td>
      </tr>
    </tbody>
  </table>
</section>


## License

Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License. See [LICENSE](LICENSE) for more information.

<p align="right">[<a href="#readme-top">Back to top</a>]</p>
