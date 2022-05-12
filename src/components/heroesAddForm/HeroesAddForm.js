import {useHttp} from '../../hooks/http.hook';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store';
import { heroCreated } from '../heroesList/heroesSlice';
import { selectAll } from '../heroesFilters/filtersSlice';

const HeroesAddForm = () => {

    const [nameHero, setNameHero] = useState('')
    const [descriptionHero, setDescriptionHero] = useState('')
    const [elementHero, setElementHero] = useState('')
    const {statusFilter} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const {request} = useHttp()
    const dispatch = useDispatch()

    const CreateItem = (event) => {

        event.preventDefault()

        const newItem = {
            id: uuidv4(),
            name: nameHero,
            description: descriptionHero,
            element: elementHero
        }

        request('http://localhost:3001/heroes', 'POST', JSON.stringify(newItem))
            .then(data => console.log(data, 'Set New Item'))
            .then(dispatch(heroCreated(newItem)))
            .catch(error => console.log(error))

        setNameHero('')
        setDescriptionHero('')
        setElementHero('')
    }

    const renderFilters = (filters, status) => {
        
        
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }
    
    return (
        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={nameHero}
                    onChange={(e)=>setNameHero(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={descriptionHero}
                    onChange={(e)=>setDescriptionHero(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={elementHero}
                    onChange={(e)=>setElementHero(e.target.value)}>
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, statusFilter)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary" onClick={CreateItem}>Создать</button>
        </form>
    )
    
}

export default HeroesAddForm;