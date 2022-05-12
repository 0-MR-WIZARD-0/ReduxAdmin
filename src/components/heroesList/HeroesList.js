import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroes, heroDeleted, selectAll } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { createSelector } from '@reduxjs/toolkit';

const HeroesList = () => {

    const filtersHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        selectAll,
        (filter, heroes) => {
            if (filter === "all"){
                return heroes
            } else {
                return heroes.filter(item => item.element === filter)
            }
        }
    )

    const filterHeroes = useSelector(filtersHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes())
        // eslint-disable-next-line
    }, []);

    const DeleteItem = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(res => console.log(res, 'Delete Item'))
            .then(dispatch(heroDeleted(id)))
            .catch(error => console.log(error));
        // eslint-disable-next-line
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} ClickDelete={()=>DeleteItem(id)}/>
        })
    }

    const elements = renderHeroesList(filterHeroes)
    
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;