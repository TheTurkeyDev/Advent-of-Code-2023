import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading, NotFound } from 'gobble-lib-react';
import { HomePage } from './pages/home';

const Days = lazy(() => import(/* webpackChunkName: "Days" */ './pages/days/days-router'));

export const AocRouter = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/day/*' element={<Days />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};
