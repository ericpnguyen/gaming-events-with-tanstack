import { Link, Outlet, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import { useParams } from "react-router-dom";
import Modal from "../UI/Modal.jsx";
import { useState } from "react";

import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  const deleteEventHandler = () => {
    mutate({ id });
  };

  const isDeletingHandler = () => {
    setIsDeleting(true);
  };

  const isNotDeletingHandler = () => {
    setIsDeleting(false);
  };

  return (
    <>
      {isDeleting && (
        <Modal onClose={isNotDeletingHandler}>
          <h2>Are you sure you want to delete this event?</h2>
          <p>This action cannot be undone.</p>
          <div className="form-actions">
            {isDeletePending && <p>Deleting event...</p>}
            {!isDeletePending && (
              <>
                <button className="button-text" onClick={isNotDeletingHandler}>
                  Cancel
                </button>
                <button className="button" onClick={deleteEventHandler}>
                  Confirm
                </button>
              </>
            )}
            {isDeleteError && (
              <ErrorBlock
                title={"Failed to remove event"}
                message={deleteError.info?.message || "Please try again later."}
              />
            )}
          </div>
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View All Events
        </Link>
      </Header>
      {isPending && <p style={{ textAlign: "center" }}>Loading event...</p>}
      {isError && (
        <ErrorBlock
          title="Failed to load event details"
          message="Please try again later."
        />
      )}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={isDeletingHandler}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img
              src={`https://gaming-events-with-tanstack-backend.onrender.com/${data.image}`}
              alt={data.title}
            />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time
                  dateTime={`Todo-DateT$Todo-Time`}
                >{`${data.date} @ ${data.time}`}</time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
