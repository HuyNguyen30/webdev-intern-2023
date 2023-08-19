import React, { useState, useEffect } from 'react';
import './App.css';
import nikeLogo from './assets/nike.png';
import data from './data/shoes.json';
import trashIcon from './assets/trash.png';


function App() {
  const [shoeList, setShoeList] = useState([data.shoes]);
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  const storedTotal = JSON.parse(localStorage.getItem('total'));
  const storedAmounts = JSON.parse(localStorage.getItem('amounts')) || shoeList[0].map(() => 0);
  const storedChecks = JSON.parse(localStorage.getItem('checks')) || shoeList[0].map(() => false);
  const [checks, setChecks] = useState(storedChecks);
  const [amounts, setAmounts] = useState(storedAmounts);
  const [total, setTotal] = useState(storedTotal || 0);
  const [cart, setCart] = useState(storedCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('total', JSON.stringify(total))
  }, [total]);
  useEffect(() => {
    localStorage.setItem('amounts', JSON.stringify(amounts))
  }, [amounts]);
  useEffect(() => {
    localStorage.setItem('checks', JSON.stringify(checks))
  }, [checks]);

  const onAdd = (index) => {
    setCart([...cart, shoeList[0][index]])
    setTotal(total + shoeList[0][index].price)
    const newAmount = [...amounts];
    newAmount[index] = newAmount[index] + 1;
    setAmounts(newAmount);
    if (!checks[index]) {
      const newCheck = [...checks];
      newCheck[index] = true;
      setChecks(newCheck);
    }
  }

  const onRemove = (index) => {
    const indexOrigin = shoeList[0].findIndex((item) => item.id === cart[index].id)
    setTotal(total - (cart[index].price * amounts[indexOrigin]))
    const newCheck = [...checks];
    newCheck[indexOrigin] = false;
    setChecks(newCheck);
    const newAmount = [...amounts];
    newAmount[indexOrigin] = 0;
    setAmounts(newAmount);
    const newCart = cart.filter((item, idx) => idx !== index);
    setCart(newCart)
  }

  const onMinus = (index) => {
    const newAmount = [...amounts];
    const indexOrigin = shoeList[0].findIndex((item) => item.id === cart[index].id)
    newAmount[indexOrigin] = newAmount[indexOrigin] - 1;
    if (newAmount[indexOrigin] === 0) {
      onRemove(index);
      return;
    }
    setAmounts(newAmount);
    setTotal(total - cart[index].price);
  }

  const onPlus = (index) => {
    const newAmount = [...amounts];
    const indexOrigin = shoeList[0].findIndex((item) => item.id === cart[index].id)
    newAmount[indexOrigin] = newAmount[indexOrigin] + 1;
    setAmounts(newAmount);
    setTotal(total + cart[index].price)
  }


  const renderShopItem = (item, index) => {
    return (
      <div className="App_shopItem">
        <div className="App_shopItemImage" style={{ backgroundColor: item.color }}>
          <img src={item.image}></img>
        </div>
        <div className="App_shopItemName">{item.name}</div>
        <div className="App_shopItemDescription">{item.description}</div>
        <div className="App_shopItemBottom">
          <div className="App_shopItemPrice">${item.price}</div>
          <div
            className="App_shopItemButton"
            onClick={() => onAdd(index)}
            disabled={checks[index]}
            style={{ pointerEvents: checks[index] ? 'none' : 'auto' }}
          >
            {!checks[index] ? <p>ADD TO CART</p> :
              <div className="App_shopItemButtonCover">
                <div className="App_shopItemButtonCoverCheckIcon"></div>
              </div>
            }</div>
        </div>
      </div>
    )
  }

  const renderCartItem = (item, index) => {
    return (
      <div>
        <div className="App_cartItem">
          <div className="App_cartItemLeft cartItemLeft">
            <div className="App_cartItemImage cartItemImage" style={{ backgroundColor: item.color }}>
              <div className="App_cartItemImageBlock">
                <img src={item.image}></img>
              </div>
            </div>
          </div>
          <div className="App_cartItemRight cartItemRight">
            <div className="App_cartItemName cartItemName">{item.name}</div>
            <div className="App_cartItemPrice cartItemPrice">${item.price}</div>
            <div className="App_cartItemActions cartItemActions">
              <div className="App_cartItemCount cardItemCount">
                <div className="App_cartItemCountButton" onClick={() => onMinus(index)}>-</div>
                <div className="App_cartItemCountNumber">
                  {amounts[shoeList[0].findIndex(e => e.id === item.id)]}
                </div>
                <div className="App_cartItemCountButton" onClick={() => onPlus(index)}>+</div>
              </div>
              <div className="App_cartItemRemove cartItemRemove">
                <img src={trashIcon} onClick={() => onRemove(index)}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  console.log({ checks, amounts, total, cart })
  console.log(localStorage)


  return (
    <div className="App_mainContent">
      <div className="App_card">
        <div className="App_cardTop">
          <img src={nikeLogo} className="App_cardTopLogo" ></img>
        </div>
        <div className="App_cardTitle">Our Products</div>

        <div className="App_cardBody">
          {shoeList[0].map((item, index) => renderShopItem(item, index))}
        </div>
      </div>

      <div className="App_card">
        <div className="App_cardTop">
          <img src={nikeLogo} className="App_cardTopLogo" ></img>
        </div>
        <div className="App_cardTitle">
          Your cart
          <span className="App_cardTitleAmount">${total.toFixed(2)}</span>
        </div>
        <div className="App_cardBody">
          {cart.length === 0 ?
            <div className="App_cartEmpty">
              <p className="App_cartEmptyText">
                Your cart is empty.
              </p>
            </div>
            : cart.map((item, index) => renderCartItem(item, index))
          }
        </div>
      </div>
    </div>
  );
}
export default App;
