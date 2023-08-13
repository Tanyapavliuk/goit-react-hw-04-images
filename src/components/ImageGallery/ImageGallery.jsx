import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import ImageGalleryItem from './ImageGalleryItem'; //окремий елемент списку
import { Loader, Heart } from 'components/Loader/Loader'; //лоадери
import { NotFaundPhoto } from 'components/SmalComponent/SmalComponent'; //якщо пустий масив
import Button from 'components/Button/Button';
import { Error } from 'components/SmalComponent/Error';

//функція Fetch---------
import { getFetch } from 'servises/fetchFn';

import { List, LoaderWrapper, TextMassage } from './ItemGallary.styled';

function ImageGallery({ searchName }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [secondFetch, setSecondFetch] = useState(1);

  useEffect(() => {
    if (!searchName) {
      return;
    }
    const getAsyncFetch = async () => {
      setSecondFetch(1);
      setData([]);
      setTotal(0);
      setPage(1);
      setStatus('pending');

      getFetch({
        search: searchName,
        page: 1,
      })
        .then(({ hits, total }) => {
          console.log(hits);
          setData([...hits]);
          setTotal(total);
          setStatus('resolved');
        })
        .catch(er => setStatus('rejected'));
    };
    getAsyncFetch();
  }, [searchName]);

  useEffect(() => {
    if (secondFetch === 1) {
      return;
    }
    const getAsyncFetch = async () => {
      getFetch({
        search: searchName,
        page: page,
      })
        .then(({ hits }) => {
          setData(prev => [...prev, ...hits]);
        })
        .catch(er => setStatus('rejected'));
    };
    getAsyncFetch();
  }, [page, secondFetch]);

  const handleClickButtonMore = () => {
    setPage(prevState => prevState + 1);
    setSecondFetch(2);
  };

  const Items = data.length ? (
    <>
      <List>
        {data.map(el => (
          <ImageGalleryItem item={el} key={el.id} />
        ))}
      </List>
      {data.length < 12 || total === data.length ? null : (
        <Button onclick={handleClickButtonMore} /> //рендер кнопки за умовою
      )}
    </>
  ) : (
    <NotFaundPhoto />
  );

  if (status === 'idle') {
    return (
      <LoaderWrapper>
        <TextMassage>Знайди потрібне тобі фото</TextMassage>
        <Heart />
      </LoaderWrapper>
    );
  }

  //йде запит за данними
  if (status === 'pending') {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  //відповідь успішна
  if (status === 'resolved') {
    return Items;
  }

  //відповідь провальна
  if (status === 'rejected') {
    return <Error />;
  }
}

export default ImageGallery;
// class ImageGallery extends Component {
//   state = {
//     data: [],
//     total: 0,
//     page: 1,
//     status: 'idle',
//     error: null,
//   };

//   //----------оновлення компоненту при зміні стейту чи пропсів-----------
//   async componentDidUpdate(prevProps, prevState) {
//     if (prevProps.searchName !== this.props.searchName) {
//       try {
//         this.setState({ page: 1, data: [], total: 0, status: 'pending' });
//         const { total, hits } = await getFetch({
//           search: this.props.searchName,
//           page: this.state.page,
//         });

//         this.setState({ data: hits, total, status: 'resolved' }); //записуємо в стейт отримані дані
//       } catch {
//         this.setState({ status: 'rejected' });
//       } //деструктурезую дані із запиту
//     }

//     if (prevState.page !== this.state.page) {
//       const { hits } = await getFetch({
//         search: this.props.searchName,
//         page: this.state.page,
//       }); //деструктурезую дані із запиту
//       if (prevProps.searchName !== this.props.searchName) {
//         this.setState({ data: hits });
//         return;
//       }
//       this.setState({ data: [...prevState.data, ...hits] });
//     }
//   }

//   handleClickButtonMore = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//     this.getFetch();
//   };

//   render() {
//     const { data, total, status } = this.state;

//     //рендер або ж елементів списку якщо є елементи у відповіді, якщо немає повідомлення, що фото немає
//     const Items = data.length ? (
//       <>
//         <List>
//           {data.map(el => (
//             <ImageGalleryItem item={el} key={el.id} />
//           ))}
//         </List>
//         {data.length < 12 || total === data.length ? null : (
//           <Button onclick={this.handleClickButtonMore} /> //рендер кнопки за умовою
//         )}
//       </>
//     ) : (
//       <NotFaundPhoto />
//     );

//     // рендер залежить від status
//     //перше завантаження
//     if (status === 'idle') {
//       return (
//         <LoaderWrapper>
//           <TextMassage>Знайди потрібне тобі фото</TextMassage>
//           <Heart />
//         </LoaderWrapper>
//       );
//     }

//     //йде запит за данними
//     if (status === 'pending') {
//       return (
//         <LoaderWrapper>
//           <Loader />
//         </LoaderWrapper>
//       );
//     }

//     //відповідь успішна
//     if (status === 'resolved') {
//       return Items;
//     }

//     //відповідь провальна
//     if (status === 'rejected') {
//       return <Error />;
//     }
//   }
// }
// export default ImageGallery;

ImageGallery.propTypes = {
  searchName: PropTypes.string.isRequired,
};
