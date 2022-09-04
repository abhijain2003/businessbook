import React, { useState, useEffect } from "react";
import { addInventory, updateInventory } from "../utils/Inventory";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

function AddNewProduct({
  supplierArray,
  setaddNewProduct,
  successNotify,
  infoNotify,
  errorNotify,
  foundUserStocks,
}) {
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);


  const items = useMemo(() => {
    return [1, 2, 3, 4]
  }, []);

  useEffect(() => {
    if (items.length && downPress) {
      setCursor((prevState) =>
        prevState < items.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress, items.length]);

  useEffect(() => {
    if (items.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress, items.length]);

  useEffect(() => {
    if (items.length && enterPress) {
      setSelected(items[cursor]);
    }
  }, [cursor, enterPress, items, items.length]);

  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered, items.length, items]);

  useEffect(() => {
    document
      .getElementById("container")
      .querySelectorAll("input")
      .forEach((node) => {
        window.addEventListener(
          "keydown",
          function (e) {
            if (e.key === "Enter") {
              document
                .getElementById("container")
                .querySelector(".actives")
                .focus();
            }
          },
          true
        );
      });
  }, []);

  const [qtn, setqtn] = useState("Quantity");
  const [productName, setproductName] = useState("");
  const [purchasedDate, setpurchasedDate] = useState("");
  const [purchasedQtn, setpurchasedQtn] = useState("");
  const [purchasedAmount, setpurchasedAmount] = useState("");
  const [purchasedFrom, setpurchasedFrom] = useState("");

  //user create new product entry or new entry with existing product.
  const [selectFromNew, setselectFromNew] = useState(true);

  const route = useParams();

  async function addStock() {
    if (
      purchasedFrom === "" ||
      productName === "" ||
      purchasedQtn === "" ||
      purchasedAmount === "" ||
      purchasedDate === ""
    ) {
      infoNotify();
      setaddNewProduct(false);
    } else {
      if (!selectFromNew) {
        const objectForUpdate = foundUserStocks.filter((val) => {
          if (val.productName === productName) {
            return val;
          }
        });

        const dateArray = [
          ...objectForUpdate[0].dateOfPurchaseArray,
          purchasedDate,
        ];
        const qtnArray = [
          ...objectForUpdate[0].totalQtnPurchasedArray,
          purchasedQtn,
        ];
        const amtArray = [
          ...objectForUpdate[0].perUnitPriceArray,
          purchasedAmount,
        ];
        const senderArray = [
          ...objectForUpdate[0].purchasedFromArray,
          purchasedFrom,
        ];

        await updateInventory(objectForUpdate[0].id, {
          dateOfPurchaseArray: dateArray,
          totalQtnPurchasedArray: qtnArray,
          perUnitPriceArray: amtArray,
          purchasedFromArray: senderArray,
        })
          .then(() => {
            successNotify();
            setaddNewProduct(false);
            window.location.reload();
          })
          .catch((err) => {
            errorNotify();
            window.location.reload();
          });
      } else {
        await addInventory(
          route.user,
          [purchasedDate],
          productName.replace(/ /g, "-"),
          [purchasedAmount],
          [purchasedQtn],
          [purchasedFrom.replace(/ /g, "-")],
          qtn
        )
          .then((res) => {
            successNotify();
            setaddNewProduct(false);
            window.location.reload();
          })
          .catch((err) => {
            errorNotify();
            window.location.reload();
          });
      }
    }
  }

  const productList = useMemo(() => [], []);
  foundUserStocks.map((val) => {
    productList.push(val.productName);
  });

  function handleSelectFromExist(val) {
    setproductName(val);
    setselectFromNew(false);
  }

  //product array based on user search
  const [userSearchedProduct, setuserSearchedProduct] = useState([]);

  useEffect(() => {
    setuserSearchedProduct(
      productList.filter((val) => {
        if (productName === "") {
          return val;
        } else if (
          val
            .split("-")
            .join(" ")
            .toLowerCase()
            .includes(productName.toLowerCase())
        ) {
          return val;
        }
      })
    );
  }, [productName, productList]);

  return (
    <div
      style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        transition: "0.4s ease-in-out",
      }}
      className="mx-auto w-[300px] h-[550px] md:w-[500px] bg-white rounded-[10px]"
    >
      <h1 className="capitailize font-bold text-center">Add Product Data</h1>
      <p onClick={() => setaddNewProduct(false)} className="float-right">X</p>

      <div className=" mt-4 w-[90%] sm:w-[60%] mx-auto text-center h-[100px] overflow-y-auto">
        {" "}
        {userSearchedProduct.map((val, i) => (
          <p
            onClick={() => handleSelectFromExist(val)}
            className="cursor-pointer w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            key={i}
          >
            {val}
          </p>
        ))}
      </div>

      <div
        id="container"
        className="grid grid-cols-2 grid-rows-3 gap-y-2 gap-x-4 p-4 sm:p-12"
      >
        <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Product Name
          </label>
          <input
            placeholder="Name of Product"
            className={`items ${cursor === 0 ? "actives" : ""
              }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
            onClick={() => setSelected(0)}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(undefined)}
            value={productName}
            onChange={(e) => setproductName(e.target.value)}
          />
        </div>

        <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Purchase Date
          </label>
          <input
            type={"date"}
            placeholder="YYYY-MM-DD"
            className={`items ${cursor === 1 ? "actives" : ""
              }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
            onClick={() => setSelected(1)}
            onMouseEnter={() => setHovered(1)}
            onMouseLeave={() => setHovered(undefined)}
            value={purchasedDate}
            onChange={(e) => setpurchasedDate(e.target.value)}
          />
        </div>

        <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Total {qtn}
          </label>
          <div className="flex">
            <select onChange={(e) => setqtn(e.target.value)}>
              <option className="p-2" value="Quantity">
                Qtn
              </option>
              <option className="p-2" value="Metre">
                Mtr.
              </option>
              <option className="p-2" value="Kilogram">
                Kg.
              </option>
            </select>
            <input
              type={"text"}
              placeholder={qtn}
              className={`items ${cursor === 2 ? "actives" : ""
                }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
              onClick={() => setSelected(2)}
              onMouseEnter={() => setHovered(2)}
              onMouseLeave={() => setHovered(undefined)}
              value={purchasedQtn}
              onChange={(e) => setpurchasedQtn(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Per Unit Price
          </label>
          <input
            type="text"
            placeholder="Rs."
            className={`items ${cursor === 3 ? "actives" : ""
              }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
            onClick={() => setSelected(3)}
            onMouseEnter={() => setHovered(3)}
            onMouseLeave={() => setHovered(undefined)}
            value={purchasedAmount}
            onChange={(e) => setpurchasedAmount(Number(e.target.value))}
          />
        </div>

        <div className="mb-4 md:mr-2 md:mb-0 col-span-2 flex flex-col">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Purchase From
          </label>
          <select
            value={purchasedFrom}
            onChange={(e) => setpurchasedFrom(e.target.value)}
            className="w-full font-medium uppercase text-center px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
          >
            {" "}
            <option value="">{"Supplier's"}</option>
            {supplierArray.map((val, i) => (
              <option key={i}>{val.split("-").join(" ")}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 md:mr-2 md:mb-0 col-span-2 flex flex-col">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Add Entry
          </label>

          {userSearchedProduct.length !== 0 && selectFromNew && productName !== "" ? (
            <p className="w-full font-medium uppercase text-center px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline">
              You are trying to create new entry of existing product. please
              select the product name from above list
            </p>
          ) : (
            <button
              onClick={() => addStock()}
              className="w-full rounded-[10px] bg-blue-600 hover:bg-blue-400 font-medium uppercase text-center px-3 py-2 text-sm leading-tight text-white border rounded shadow focus:outline-none focus:shadow-outline"
            >
              Add +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddNewProduct;
