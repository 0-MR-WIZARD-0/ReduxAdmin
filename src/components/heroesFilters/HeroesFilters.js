import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from '../../store';
import { changedFilter, fetchFilter, selectAll } from "./filtersSlice";
import Spinner from "../spinner/Spinner";
import classNames from 'classnames';

const HeroesFilters = () => {

    const {filtersLoadingStatus, activeFilter} = useSelector(state=>state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch()
    
    useEffect(()=>{
        dispatch(fetchFilter())
        // eslint-disable-next-line
    },[])

    if(filtersLoadingStatus === "loading"){
        return <Spinner/>
    }else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const filterHeroesRender = (array) => {

        if (array.length === 0){
            return <h5 className="text-center mt-5">Фильтров не обнаружено</h5>
        }

        return array.map(({name, className, label}) =>{
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            });

            return <button
                key={name}
                id={name}
                className={btnClass}
                onClick={()=>dispatch(changedFilter(name))}
            >{label}</button>
        }) 
        
    }

    const elements = filterHeroesRender(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;