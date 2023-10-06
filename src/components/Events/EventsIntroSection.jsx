import { Link } from "react-router-dom";

import meetupImg from "../../assets/meetup.jpg";

export default function EventsIntroSection() {
  return (
    <section
      className="content-section"
      id="overview-section"
      style={{ backgroundImage: `url(${meetupImg})` }}
    >
      <h2>
        Create amazing moments <br />
        with gamers at <strong>your own events</strong>
      </h2>
      <p>Anyone can organize and join events on Gaming Events!</p>
      <p>
        <Link to="/events/new" className="button">
          Create your first event
        </Link>
      </p>
    </section>
  );
}
