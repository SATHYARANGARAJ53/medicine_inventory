import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Footer from "../Components/Footer";

function Home() {
  return (
    <>
      <section className="Home">
        <div className="content">
          <h1 className="text-primary text-md-danger">AI - DRIVEN MEDICINE INVENTORY MANAGAGEMENT SYSTEM</h1>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
            eos esse ratione consequuntur, pariatur et tempora quaerat
            accusantium, asperiores delectus minima saepe ipsam eum itaque quas
            architecto odio sunt incidunt dignissimos. Saepe asperiores aut
            cumque nam, natus iure sit ad quam esse aliquid, sunt in incidunt
            inventore officia nobis a Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Velit incidunt magnam minus consequuntur eius a
            maiores eligendi. Voluptates, distinctio explicabo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quas nulla nemo officia, maiores nobis aspernatur vitae perspiciatis recusandae odit.
          </p>
          <br />
          <Link to="/register">
            <button className="butt btn btn-primary">
              <span>Get Started</span>
            </button>
          </Link>
        </div>
        <div className="hero">
          <img
            src="https://www.mypathologic.com/assets/image/features/online.png"
            alt="homeIcon"
          className="img-fluid"/>
        </div>
      </section>
      <section className="mid">
        <div className="box">
          <h3>Tracking the Medicine Availability</h3>
          <img
            src="https://th.bing.com/th/id/OIP.lxZ8fMMOdh0goL0WXjxhKAHaHa?rs=1&pid=ImgDetMain"
            alt="image1"
          />
          <p>
            Our medical application ensures efficient tracking of medicine Availability,helping clinics and pharmacies manage stocks seamlessly.With real-time inventory updates,automated alerts for low stock, and quick search features,it minimizes the shortages and improves the patient care.Stay informed,reduce waste and ensure uninteruppted access to essential medicines with our smart solution.
          </p>
        </div>
        <div className="box">
          <h3>Monitoring the Quality of Medicines</h3>

          <img
            src="https://cdn-icons-png.flaticon.com/512/6389/6389400.png"
            alt="image2" id="img2"
          />
          <p>
             Our medical application enables precise monitoring of medicine quality,ensuring patient safety and complience.It tracks expiration dates,storage conditions, and batch details,sending alerts for expired or compromised medicines.With the real-time data and automated quality checks,it helps maintain high statndards and ensures only safe medicines are dispensed.
          </p>
        </div>
        <div className="box">
          <h3>Efficient Medicine Redistribution</h3>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5979/5979347.png"
            alt="image3"
          />
          <p>
           our medical application streamlines efficient medicine redistribution,reducing waste and ensuring timely access to essential drugs.It tracks surplus medicines,identifies demand across locations and facilities seamless transfers.With real-time inventory updates and automated alerts,it optimizes resource utilization and improves healthcare accessiblity for patients in need.
          </p>
        </div>
      </section>

      <section className="contact">
        <h1>Contact with us!</h1>
        <form action="mailto:kingimmanuel1221@gmail.com" method="post" encType="text/plain">
          <label htmlFor="name">
            Name
            <input type="text" name="" id="" className="form-control py-4" />
          </label>
          <label htmlFor="email">
            Email
            <input type="email" name="" id="" className="form-control py-4" />
          </label>
          <label htmlFor="number">
            Phone Number
            <input type="tel" name="" id="" className="form-control py-4" />
          </label>
          <label htmlFor="district">
            District
            <input type="text" name="" id="" className="form-control py-4" />
          </label>
          <br />
          <input
            type="submit"
            value="Submit"
            className="btn btn-primary py-4"
          />
        </form>
      </section>
      <Footer />
    </>
  );
}

export default Home;
