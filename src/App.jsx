import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Loader from "./components/Loader";
import Modal from "./components/Modal";
// import { fetchImages } from "./reducers/ImageSlice";
import {
  prev,
  next,
  setter,
  recieveImagesPending,
} from "./reducers/ImageSlice";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const [selectFilter, setSelectFilter] = useState("");

  const { images, backup, page, isLoading, isError } = useSelector(
    (state) => state.images
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recieveImagesPending(page));
  }, [page]);

  // console.log("backup images", backup);
  // console.log("IMAGES", images);

  const handleSearch = (value) => {
    setSearchedText(value);
    if (value === "") {
      dispatch(setter(backup));
      return;
    }
    const searchedImgs = [...backup].filter((img) => {
      if (img.description !== null) {
        return img.description.indexOf(value) === -1 ? false : true;
      } else if (img.alt_description !== null) {
        return img.alt_description.indexOf(value) === -1 ? false : true;
      } else return false;
    });
    dispatch(setter(searchedImgs));
  };

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };

  const handleSetImages = (img) => {
    dispatch(setter([img, ...images]));
  };

  const handleFilter = (value) => {
    setSelectFilter(value);
    let filterImgs = [];
    if (value === "date") {
      filterImgs = [...backup].sort((a, b) => {
        let aD = new Date(a.created_at);
        let bD = new Date(b.created_at);
        return aD - bD;
      });
    } else if (value === "description") {
      filterImgs = [...backup].sort((a, b) => {
        let aDesc =
          a.description?.toLowerCase() || a.alt_description?.toLowerCase();
        let bDesc =
          b.description?.toLowerCase() || b.alt_description?.toLowerCase();

        if (aDesc < bDesc) {
          return -1;
        } else if (aDesc > bDesc) {
          return 1;
        }
        return 0;
      });
    } else if (value === "none") {
      filterImgs = backup;
    }
    dispatch(setter([...filterImgs]));
  };
  const handleToggleSelection = (id) => {
    let isSelected = false;
    for (let selected of selectedImages) {
      if (selected === id) isSelected = true;
    }
    return isSelected;
  };

  const handleDeselectAll = () => {
    setSelectedImages([]);
    setIsAllSelected(false);
  };

  const handleSelectAll = () => {
    const all = images.map((img) => img.id);
    setSelectedImages(all);
    setIsAllSelected(true);
  };

  const handleDelete = () => {
    const newImages = [];
    for (let image of images) {
      let isHere = false;
      for (let select of selectedImages) {
        if (image.id === select) isHere = true;
      }

      if (!isHere) newImages.push(image);
    }
    dispatch(setter(newImages));
    setSelectedImages([]);
  };

  const handleClick = (imgId) => {
    let newImages = selectedImages.filter((img) => img !== imgId);
    let isHere = false;
    for (let select of selectedImages) {
      if (imgId === select) isHere = true;
    }

    if (isHere) {
      setSelectedImages(newImages);
    } else {
      setSelectedImages([...newImages, imgId]);
    }
  };

  const handlePrev = () => {
    dispatch(prev());
    setSelectFilter("");
  };

  const handleNext = () => {
    dispatch(next());
    setSelectFilter("");
  };

  const modifyDate = (date) => {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const day = new Date(date).getDate();
    return [day, month, year];
  };

  const modifyDescription = (desc) => {
    if (!desc) return "NA";
    if (desc?.length > 35) {
      const newDesc = desc.slice(0, 35);
      return newDesc + "...";
    }
    return desc + "...";
  };

  return (
    <div className="main">
      {isModalOpen && (
        <Modal
          handleSetImages={handleSetImages}
          handleModalOpen={handleModalOpen}
        />
      )}
      <h1>The Sea of Images</h1>
      <input
        type="text"
        placeholder="Search images"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="customise">
        <div className="btns">
          {isAllSelected ? (
            <button onClick={handleDeselectAll}>Deselect All</button>
          ) : (
            <button onClick={handleSelectAll}>Select All</button>
          )}
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => setIsModalOpen(true)}>Add</button>
        </div>
        <div className="filter">
          <span style={{ marginRight: "0.5rem" }}> Sort By</span>
          <select
            name="filter"
            value={selectFilter}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="none">Please select</option>
            <option value="date">Date</option>
            <option value="description">Description</option>
          </select>
        </div>
      </div>
      {searchedText.length !== 0 && (
        <span style={{ textAlign: "left" }}>
          Showing {images.length} image(s)
        </span>
      )}
      {/* {It is to test that Loader is showing or not} */}
      {/* {We have to remove this pagination} */}
      {!isError && (
        <div className="pagination">
          <h3 style={{ textDecoration: "underline" }}>
            Showing {page} of 55 pages
          </h3>
          <div className="page-btn">
            {page !== 1 && <button onClick={handlePrev}>Prev</button>}
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      <div className="img-container">
        {isLoading && <Loader message="LOADING..." />}
        {isError && <Loader message="Error: Unable to fetch data !!!" />}
        {!isLoading &&
          !isError &&
          images.map((image) => {
            return (
              <div key={image.id} className="wrapper">
                <img
                  src={image.urls.small}
                  onClick={() => handleClick(image.id)}
                  className={handleToggleSelection(image.id) ? "selection" : ""}
                />
                <div className="desc">
                  <p>
                    <span style={{ fontWeight: " bold" }}>Description:</span>{" "}
                    <a
                      style={{ color: "black" }}
                      href="#"
                      title={image?.description || image?.alt_description}
                    >
                      {modifyDescription(
                        image?.description || image?.alt_description
                      )}
                    </a>
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Created At:</span>{" "}
                    {modifyDate(image?.created_at).join("-")}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      {!isError && (
        <div className="pagination">
          <h3 style={{ textDecoration: "underline" }}>
            Showing {page} of 55 pages
          </h3>
          <div className="page-btn">
            {page !== 1 && <button onClick={handlePrev}>Prev</button>}
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
